const db = require("../../config/db");
const { OVERDUE_FINE_PER_DAY } = require("../../config/library");

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
    CASE
        WHEN mt.NgayTra IS NOT NULL AND mt.NgayTra > mt.HanTra
        THEN DATEDIFF(mt.NgayTra, mt.HanTra) * ${OVERDUE_FINE_PER_DAY}
        ELSE 0
    END AS TienPhat
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
                COALESCE(SUM(
                    GREATEST(DATEDIFF(mt.NgayTra, mt.HanTra), 0) * ${OVERDUE_FINE_PER_DAY}
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

            await this.#assertDocGiaExists(connection, muonTra.getMaDG());
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

            await this.#assertDocGiaExists(connection, muonTra.getMaDG());
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

    async returnBooks(maMT, ngayTra) {
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

            const [details] = await connection.query(
                "SELECT MaSach, SoLuong FROM chitietmuontra WHERE MaMT = ?",
                [maMT]
            );

            if (details.length === 0) {
                throw new Error("Phieu muon khong co chi tiet sach");
            }

            for (const item of details) {
                await connection.query(
                    "UPDATE sach SET SoLuong = COALESCE(SoLuong, 0) + ? WHERE MaSach = ?",
                    [item.SoLuong, item.MaSach]
                );
            }

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

    async #assertDocGiaExists(connection, maDG) {
        const [rows] = await connection.query("SELECT MaDG FROM docgia WHERE MaDG = ?", [maDG]);

        if (!rows[0]) {
            throw new Error("Doc gia khong ton tai");
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
            "SELECT MaMT, TrangThai, NgayTra FROM muontra WHERE MaMT = ? FOR UPDATE",
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
            const soNgayTre = row.NgayTra && row.NgayTra > row.HanTra
                ? Math.max(
                    0,
                    Math.ceil(
                        (new Date(row.NgayTra) - new Date(row.HanTra))
                        / 86400000
                    )
                )
                : 0;

            return {
                ...row,
                SoDauSach: chiTiet.length,
                TongSoLuong: tongSoLuong,
                TienPhat: soNgayTre * OVERDUE_FINE_PER_DAY,
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
