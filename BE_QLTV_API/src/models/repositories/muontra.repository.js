const db = require("../../config/db");

const PHIEU_MUON_COLUMNS = `
    mt.MaMT,
    mt.MaDG,
    dg.TenDG,
    mt.MaNV,
    nv.TenNV,
    mt.NgayMuon,
    mt.HanTra,
    mt.NgayTra,
    CASE
        WHEN mt.NgayTra IS NOT NULL THEN 'Đã trả'
        WHEN mt.HanTra < CURDATE() THEN 'Quá hạn'
        ELSE 'Đang mượn'
    END AS TrangThai,
    COUNT(ct.MaSach) AS SoDauSach,
    COALESCE(SUM(ct.SoLuong), 0) AS TongSoLuong,
    COALESCE((
        SELECT SUM(vp.SoTien)
        FROM xulyvipham vp
        WHERE vp.MaMT = mt.MaMT
    ), 0) AS TienPhat
`;

class MuonTraRepository {
    async getAll() {
        const sql = `
            SELECT ${PHIEU_MUON_COLUMNS}
            FROM muontra mt
            LEFT JOIN docgia dg ON mt.MaDG = dg.MaDG
            LEFT JOIN nhanvien nv ON mt.MaNV = nv.MaNV
            LEFT JOIN chitietmuontra ct ON mt.MaMT = ct.MaMT
            GROUP BY mt.MaMT, mt.MaDG, dg.TenDG, mt.MaNV, nv.TenNV, mt.NgayMuon, mt.HanTra, mt.NgayTra, mt.TrangThai
            ORDER BY mt.MaMT
        `;
        const [rows] = await db.query(sql);

        return await this.#attachDetails(rows);
    }

    async getById(maMT) {
        const sql = `
            SELECT ${PHIEU_MUON_COLUMNS}
            FROM muontra mt
            LEFT JOIN docgia dg ON mt.MaDG = dg.MaDG
            LEFT JOIN nhanvien nv ON mt.MaNV = nv.MaNV
            LEFT JOIN chitietmuontra ct ON mt.MaMT = ct.MaMT
            WHERE mt.MaMT = ?
            GROUP BY mt.MaMT, mt.MaDG, dg.TenDG, mt.MaNV, nv.TenNV, mt.NgayMuon, mt.HanTra, mt.NgayTra, mt.TrangThai
        `;
        const [rows] = await db.query(sql, [maMT]);

        if (!rows[0]) {
            return null;
        }

        const [result] = await this.#attachDetails([rows[0]]);
        return result;
    }

    async search(keyword) {
        const sql = `
            SELECT ${PHIEU_MUON_COLUMNS}
            FROM muontra mt
            LEFT JOIN docgia dg ON mt.MaDG = dg.MaDG
            LEFT JOIN nhanvien nv ON mt.MaNV = nv.MaNV
            LEFT JOIN chitietmuontra ct ON mt.MaMT = ct.MaMT
            LEFT JOIN sach s ON ct.MaSach = s.MaSach
            WHERE mt.MaMT LIKE ?
                OR dg.TenDG LIKE ?
                OR s.TenSach LIKE ?
                OR mt.NgayTra LIKE ?
            GROUP BY mt.MaMT, mt.MaDG, dg.TenDG, mt.MaNV, nv.TenNV, mt.NgayMuon, mt.HanTra, mt.NgayTra, mt.TrangThai
            ORDER BY mt.MaMT
        `;
        const searchValue = `%${keyword}%`;
        const [rows] = await db.query(sql, [searchValue, searchValue, searchValue, searchValue]);

        return await this.#attachDetails(rows);
    }

    async getStatistics() {
        const [summaryRows] = await db.query(`
            SELECT
                COUNT(mt.MaMT) AS TongPhieuMuon,
                SUM(CASE WHEN mt.NgayTra IS NULL THEN 1 ELSE 0 END) AS PhieuDangMuon,
                SUM(CASE WHEN mt.NgayTra IS NOT NULL THEN 1 ELSE 0 END) AS PhieuDaTra,
                SUM(CASE WHEN mt.HanTra < CURDATE() AND mt.NgayTra IS NULL THEN 1 ELSE 0 END) AS PhieuQuaHan,
                COALESCE((
                    SELECT SUM(vp.SoTien)
                    FROM xulyvipham vp
                    WHERE vp.TrangThaiThu = 'DA_THU'
                ), 0) AS TongTienPhatDaThu
            FROM muontra mt
        `);

        const [byStatusRows] = await db.query(`
            SELECT
                COALESCE(TrangThai, 'Khong xac dinh') AS TrangThai,
                COUNT(MaMT) AS SoLuong
            FROM muontra
            GROUP BY COALESCE(TrangThai, 'Khong xac dinh')
            ORDER BY TrangThai
        `);

        const [byReaderRows] = await db.query(`
            SELECT
                mt.MaDG,
                dg.TenDG,
                COUNT(mt.MaMT) AS TongPhieuMuon
            FROM muontra mt
            LEFT JOIN docgia dg ON mt.MaDG = dg.MaDG
            GROUP BY mt.MaDG, dg.TenDG
            ORDER BY TongPhieuMuon DESC, mt.MaDG
        `);

        const [popularBookRows] = await db.query(`
            SELECT
                ct.MaSach,
                s.TenSach,
                COALESCE(SUM(ct.SoLuong), 0) AS TongLuotMuon
            FROM chitietmuontra ct
            LEFT JOIN sach s ON ct.MaSach = s.MaSach
            GROUP BY ct.MaSach, s.TenSach
            ORDER BY TongLuotMuon DESC, ct.MaSach
        `);

        return {
            tongQuan: summaryRows[0],
            theoTrangThai: byStatusRows,
            theoDocGia: byReaderRows,
            sachMuonNhieu: popularBookRows
        };
    }

    async create(muonTra, chiTiet) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            await this.#assertReaderCanBorrow(connection, muonTra.getMaDG());
            await this.#assertNhanVienExists(connection, muonTra.getMaNV());
            await this.#insertMuonTra(connection, muonTra);
            await this.#insertDetailsAndAdjustStock(connection, muonTra.getMaMT(), chiTiet, {});

            await connection.commit();

            return await this.getById(muonTra.getMaMT());
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async update(maMT, muonTra, chiTiet) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const current = await this.#getMuonTraForUpdate(connection, maMT);

            if (!current) {
                throw new Error("Khong tim thay phieu muon");
            }

            if (current.NgayTra) {
                throw new Error("Khong the sua phieu muon da tra");
            }

            if (current.QuaHan) {
                throw new Error("Khong the sua phieu muon da qua han");
            }

            if (String(current.MaDG) !== String(muonTra.getMaDG())) {
                throw new Error("Khong duoc thay doi doc gia cua phieu muon");
            }

            await this.#assertReaderCanBorrow(connection, muonTra.getMaDG(), maMT);
            await this.#assertNhanVienExists(connection, muonTra.getMaNV());

            const oldDetails = await this.#getDetailsMap(connection, maMT);

            await connection.query(`
                UPDATE muontra
                SET MaDG = ?, MaNV = ?, NgayMuon = ?, HanTra = ?, TrangThai = ?
                WHERE MaMT = ?
            `, [
                muonTra.getMaDG(),
                muonTra.getMaNV(),
                muonTra.getNgayMuon(),
                muonTra.getHanTra(),
                muonTra.getTrangThai(),
                maMT
            ]);

            await connection.query("DELETE FROM chitietmuontra WHERE MaMT = ?", [maMT]);
            await this.#insertDetailsAndAdjustStock(connection, maMT, chiTiet, oldDetails);

            await connection.commit();

            return await this.getById(maMT);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async returnBooks(maMT, ngayTra, chiTietTra = [], employeeId) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const current = await this.#getMuonTraForUpdate(connection, maMT);

            if (!current) {
                throw new Error("Khong tim thay phieu muon");
            }

            if (current.NgayTra) {
                throw new Error("Phieu muon da duoc tra");
            }

            const returnDateValue = String(ngayTra).slice(0, 10);
            const borrowDateValue = String(current.NgayMuon).slice(0, 10);

            if (returnDateValue < borrowDateValue) {
                throw new Error("Ngay tra khong duoc nho hon ngay muon");
            }

            await this.#assertNhanVienExists(connection, employeeId);

            const [details] = await connection.query(
                "SELECT MaSach, SoLuong FROM chitietmuontra WHERE MaMT = ?",
                [maMT]
            );

            if (details.length === 0) {
                throw new Error("Phieu muon khong co chi tiet sach");
            }

            const [ruleRows] = await connection.query(
                "SELECT PhiQuaHanMoiNgay, PhiHuHongMoiBan, PhiLamMatMoiBan FROM quydinhthuvien WHERE MaQD = 1 FOR UPDATE"
            );
            if (!ruleRows[0]) throw new Error("Chua cau hinh quy dinh thu vien");
            const rules = ruleRows[0];

            const returnDetails = new Map(chiTietTra.map((item) => [String(item.MaSach), item]));

            for (const item of details) {
                const condition = returnDetails.get(String(item.MaSach)) || {};
                const damaged = Number(condition.SoLuongHong || 0);
                const lost = Number(condition.SoLuongMat || 0);
                if (!Number.isInteger(damaged) || !Number.isInteger(lost) || damaged + lost > Number(item.SoLuong)) {
                    throw new Error(`So luong sach hong, mat cua ${item.MaSach} khong hop le`);
                }
                const goodQuantity = Number(item.SoLuong) - damaged - lost;
                await connection.query(
                    "UPDATE sach SET SoLuong = COALESCE(SoLuong, 0) + ? WHERE MaSach = ?",
                    [goodQuantity, item.MaSach]
                );

                if (damaged > 0) await this.#insertViolation(connection, {
                    maMT, maSach: item.MaSach, type: "HU_HONG", quantity: damaged,
                    amount: damaged * Number(rules.PhiHuHongMoiBan), description: condition.MoTa,
                    date: ngayTra, employeeId
                });
                if (lost > 0) await this.#insertViolation(connection, {
                    maMT, maSach: item.MaSach, type: "LAM_MAT", quantity: lost,
                    amount: lost * Number(rules.PhiLamMatMoiBan), description: condition.MoTa,
                    date: ngayTra, employeeId
                });
            }

            const dueDateValue = String(current.HanTra).slice(0, 10);
            const overdueDays = Math.max(0, Math.ceil(
                (new Date(`${returnDateValue}T00:00:00`) - new Date(`${dueDateValue}T00:00:00`)) / 86400000
            ));
            if (overdueDays > 0) await this.#insertViolation(connection, {
                maMT, maSach: null, type: "QUA_HAN",
                quantity: details.reduce((total, item) => total + Number(item.SoLuong), 0),
                amount: overdueDays * Number(rules.PhiQuaHanMoiNgay),
                description: `Quá hạn ${overdueDays} ngày`, date: ngayTra, employeeId
            });

            await connection.query(
                "UPDATE muontra SET NgayTra = ?, TrangThai = ? WHERE MaMT = ?",
                [ngayTra, "Da tra", maMT]
            );

            await connection.commit();
            return await this.getById(maMT);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async #insertViolation(connection, {
        maMT, maSach, type, quantity, amount, description, date, employeeId
    }) {
        const fine = Math.max(Number(amount || 0), 0);
        const collected = fine > 0;
        await connection.query(`INSERT INTO xulyvipham
            (MaMT, MaSach, LoaiViPham, SoLuong, SoTien, MoTa, TrangThaiThu, NgayLap, NgayThu, MaNVThu)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            maMT, maSach, type, quantity, fine, description || null,
            collected ? "DA_THU" : "MIEN_PHAT", date,
            collected ? date : null, collected ? employeeId : null
        ]);
    }

    async delete(maMT) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const current = await this.#getMuonTraForUpdate(connection, maMT);

            if (!current) {
                throw new Error("Khong tim thay phieu muon");
            }

            if (!current.NgayTra) {
                throw new Error("Chi duoc xoa phieu muon da tra");
            }

            const [violationRows] = await connection.query(
                "SELECT MaVP FROM xulyvipham WHERE MaMT = ? LIMIT 1 FOR UPDATE",
                [maMT]
            );
            if (violationRows[0]) {
                throw new Error(
                    "Không thể xóa phiếu mượn đã phát sinh vi phạm. Phiếu cần được giữ lại để bảo toàn lịch sử thu tiền."
                );
            }

            await connection.query("DELETE FROM chitietmuontra WHERE MaMT = ?", [maMT]);
            const [result] = await connection.query("DELETE FROM muontra WHERE MaMT = ?", [maMT]);

            await connection.commit();

            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async #assertReaderCanBorrow(connection, maDG, excludedLoanId = null) {
        const [rows] = await connection.query(
            "SELECT MaDG FROM docgia WHERE MaDG = ? FOR UPDATE",
            [maDG]
        );

        if (!rows[0]) {
            throw new Error("Doc gia khong ton tai");
        }


        const [cardRows] = await connection.query(`
            SELECT
                MaThe,
                DATE_FORMAT(NgayCap, '%d/%m/%Y') AS NgayCapHienThi,
                DATE_FORMAT(NgayHetHan, '%d/%m/%Y') AS NgayHetHanHienThi,
                (NgayCap > CURDATE()) AS ChuaCoHieuLuc,
                (NgayHetHan < CURDATE()) AS DaHetHan
            FROM thethuvien
            WHERE MaDG = ?
            ORDER BY NgayHetHan DESC
            FOR UPDATE
        `, [maDG]);

        if (cardRows.length === 0) {
            throw new Error(
                "Độc giả chưa có thẻ thư viện. Vui lòng cấp thẻ trước khi lập phiếu mượn."
            );
        }

        const activeCard = cardRows.find(
            (card) => !card.ChuaCoHieuLuc && !card.DaHetHan
        );

        if (!activeCard) {
            const latestCard = cardRows[0];

            if (latestCard.ChuaCoHieuLuc) {
                throw new Error(
                    `Thẻ thư viện chưa có hiệu lực (ngày cấp ${latestCard.NgayCapHienThi}).`
                );
            }

            throw new Error(
                `Thẻ thư viện đã hết hạn ngày ${latestCard.NgayHetHanHienThi}. Vui lòng gia hạn thẻ trước khi mượn sách.`
            );
        }

        const openLoanSql = excludedLoanId
            ? "SELECT MaMT FROM muontra WHERE MaDG = ? AND NgayTra IS NULL AND MaMT <> ? LIMIT 1 FOR UPDATE"
            : "SELECT MaMT FROM muontra WHERE MaDG = ? AND NgayTra IS NULL LIMIT 1 FOR UPDATE";
        const openLoanParams = excludedLoanId ? [maDG, excludedLoanId] : [maDG];
        const [openLoanRows] = await connection.query(openLoanSql, openLoanParams);

        if (openLoanRows[0]) {
            throw new Error(
                `Độc giả đang có phiếu ${openLoanRows[0].MaMT} chưa trả. Vui lòng hoàn tất phiếu hiện tại trước khi mượn tiếp.`
            );
        }
    }

    async #assertNhanVienExists(connection, maNV) {
        const [rows] = await connection.query("SELECT MaNV FROM nhanvien WHERE MaNV = ?", [maNV]);

        if (!rows[0]) {
            throw new Error("Nhan vien khong ton tai");
        }
    }

    async #getMuonTraForUpdate(connection, maMT) {
        const [rows] = await connection.query(
            `SELECT MaMT, MaDG, TrangThai, NgayMuon, HanTra, NgayTra,
                (NgayTra IS NULL AND HanTra < CURDATE()) AS QuaHan
             FROM muontra
             WHERE MaMT = ?
             FOR UPDATE`,
            [maMT]
        );
        return rows[0];
    }

    async #insertMuonTra(connection, muonTra) {
        const [result] = await connection.query(`
            INSERT INTO muontra
            (MaMT, MaDG, MaNV, NgayMuon, HanTra, NgayTra, TrangThai)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            muonTra.getMaMT(),
            muonTra.getMaDG(),
            muonTra.getMaNV(),
            muonTra.getNgayMuon(),
            muonTra.getHanTra(),
            muonTra.getNgayTra(),
            muonTra.getTrangThai()
        ]);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them phieu muon");
        }
    }

    async #getDetailsMap(connection, maMT) {
        const [rows] = await connection.query("SELECT MaSach, SoLuong FROM chitietmuontra WHERE MaMT = ?", [maMT]);
        const details = {};

        rows.forEach((row) => {
            details[row.MaSach] = Number(row.SoLuong);
        });

        return details;
    }

    async #attachDetails(rows) {
        if (rows.length === 0) {
            return rows;
        }

        const [details] = await db.query(`
            SELECT
                ct.MaMT,
                ct.MaSach,
                s.TenSach,
                ct.SoLuong
            FROM chitietmuontra ct
            LEFT JOIN sach s ON ct.MaSach = s.MaSach
            ORDER BY ct.MaMT, ct.MaSach
        `);

        const detailsByLoan = new Map();

        details.forEach((detail) => {
            const key = String(detail.MaMT);
            const currentDetails = detailsByLoan.get(key) || [];
            currentDetails.push(detail);
            detailsByLoan.set(key, currentDetails);
        });

        return rows.map((row) => {
            const chiTiet = detailsByLoan.get(String(row.MaMT)) || [];
            const tongSoLuong = chiTiet.reduce(
                (total, detail) => total + Number(detail.SoLuong || 0),
                0
            );
            return {
                ...row,
                SoDauSach: chiTiet.length,
                TongSoLuong: tongSoLuong,
                TienPhat: Number(row.TienPhat || 0),
                ChiTiet: chiTiet
            };
        });
    }

    async #insertDetailsAndAdjustStock(connection, maMT, chiTiet, oldDetails) {
        for (const item of chiTiet) {
            const oldQuantity = oldDetails[item.MaSach] || 0;
            const newQuantity = Number(item.SoLuong);
            const difference = newQuantity - oldQuantity;

            const [bookRows] = await connection.query(
                "SELECT MaSach, TenSach, SoLuong FROM sach WHERE MaSach = ? FOR UPDATE",
                [item.MaSach]
            );

            if (!bookRows[0]) {
                throw new Error(`Sach ${item.MaSach} khong ton tai`);
            }

            const currentStock = Number(bookRows[0].SoLuong || 0);

            if (difference > currentStock) {
                throw new Error(`Sach ${bookRows[0].TenSach} khong du so luong`);
            }

            if (difference !== 0) {
                await connection.query(
                    "UPDATE sach SET SoLuong = SoLuong - ? WHERE MaSach = ?",
                    [difference, item.MaSach]
                );
            }

            await connection.query(
                "INSERT INTO chitietmuontra (MaMT, MaSach, SoLuong) VALUES (?, ?, ?)",
                [maMT, item.MaSach, newQuantity]
            );

            delete oldDetails[item.MaSach];
        }

        for (const maSach of Object.keys(oldDetails)) {
            await connection.query(
                "UPDATE sach SET SoLuong = SoLuong + ? WHERE MaSach = ?",
                [oldDetails[maSach], maSach]
            );
        }
    }
}

module.exports = new MuonTraRepository();
