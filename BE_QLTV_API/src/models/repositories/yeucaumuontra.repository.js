const db = require("../../config/db");

function buildNextLoanId(loanIds) {
    const highestNumber = loanIds.reduce((highest, loanId) => {
        const match = /^MT(\d+)$/.exec(String(loanId));
        if (!match) return highest;

        return Math.max(highest, Number(match[1]));
    }, 0);

    return `MT${String(highestNumber + 1).padStart(3, "0")}`;
}

class YeuCauMuonTraRepository {
    async getAll(filters = {}, readerId = null) {
        const { where, params } = this.#buildListFilters(filters, readerId);
        const [requests] = await db.query(`
            SELECT yc.MaYC, yc.LoaiYeuCau, yc.MaDG, dg.TenDG, yc.MaMT,
                yc.TrangThai, yc.LyDoTuChoi, yc.NgayYeuCau, yc.NgayXuLy,
                yc.MaNVXuLy, nv.TenNV AS TenNVXuLy
            FROM yeucaumuontra yc
            INNER JOIN docgia dg ON dg.MaDG = yc.MaDG
            LEFT JOIN nhanvien nv ON nv.MaNV = yc.MaNVXuLy
            ${where}
            ORDER BY yc.TrangThai = 'CHO_DUYET' DESC, yc.NgayYeuCau DESC, yc.MaYC DESC
        `, params);
        return this.#attachDetails(requests);
    }

    #buildListFilters(filters, readerId) {
        const conditions = [];
        const params = [];

        if (readerId) {
            conditions.push("yc.MaDG = ?");
            params.push(readerId);
        }

        if (filters.trangThai) {
            conditions.push("yc.TrangThai = ?");
            params.push(filters.trangThai);
        }

        conditions.push("yc.LoaiYeuCau = 'MUON'");

        if (filters.keyword) {
            const keyword = `%${filters.keyword}%`;
            conditions.push("(CAST(yc.MaYC AS CHAR) LIKE ? OR yc.MaDG LIKE ? OR dg.TenDG LIKE ? OR yc.MaMT LIKE ?)");
            params.push(keyword, keyword, keyword, keyword);
        }

        return {
            where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
            params
        };
    }

    async getById(requestId) {
        const [rows] = await db.query(`
            SELECT yc.MaYC, yc.LoaiYeuCau, yc.MaDG, dg.TenDG, yc.MaMT,
                yc.TrangThai, yc.LyDoTuChoi, yc.NgayYeuCau, yc.NgayXuLy,
                yc.MaNVXuLy, nv.TenNV AS TenNVXuLy
            FROM yeucaumuontra yc
            INNER JOIN docgia dg ON dg.MaDG = yc.MaDG
            LEFT JOIN nhanvien nv ON nv.MaNV = yc.MaNVXuLy
            WHERE yc.MaYC = ?
        `, [requestId]);
        if (!rows[0]) return null;
        const [request] = await this.#attachDetails([rows[0]]);
        return request;
    }

    async create(readerId, data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            await this.#assertReaderExists(connection, readerId);

            await this.#assertReaderCanRequestBorrow(connection, readerId);
            await this.#assertBooksAvailable(connection, data.ChiTiet);

            const [result] = await connection.query(`
                INSERT INTO yeucaumuontra (LoaiYeuCau, MaDG, MaMT)
                VALUES ('MUON', ?, NULL)
            `, [readerId]);

            await this.#insertBorrowRequestDetails(connection, result.insertId, data.ChiTiet);

            await connection.commit();
            return await this.getById(result.insertId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async cancel(requestId, readerId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const request = await this.#getForUpdate(connection, requestId);
            if (!request || request.LoaiYeuCau !== "MUON" || String(request.MaDG) !== String(readerId)) {
                throw new Error("Không tìm thấy yêu cầu");
            }
            if (request.TrangThai !== "CHO_DUYET") {
                throw new Error("Chỉ được hủy yêu cầu đang chờ duyệt");
            }
            await connection.query(
                "UPDATE yeucaumuontra SET TrangThai = 'DA_HUY' WHERE MaYC = ?",
                [requestId]
            );
            await connection.commit();
            return await this.getById(requestId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async approveBorrow(requestId, employeeId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const request = await this.#getForUpdate(connection, requestId);
            if (!request) throw new Error("Không tìm thấy yêu cầu");
            if (request.LoaiYeuCau !== "MUON") throw new Error("Đây không phải yêu cầu mượn sách");
            if (request.TrangThai !== "CHO_DUYET") throw new Error("Yêu cầu đã được xử lý");
            await this.#assertEmployeeExists(connection, employeeId);
            await this.#assertReaderCanRequestBorrow(connection, request.MaDG, requestId);
            await connection.query(`
                UPDATE yeucaumuontra
                SET TrangThai = 'DA_DUYET', NgayXuLy = NOW(), MaNVXuLy = ?
                WHERE MaYC = ?
            `, [employeeId, requestId]);
            await connection.commit();
            return await this.getById(requestId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async confirmPickup(requestId, dueDate, employeeId, borrowDate) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const request = await this.#getForUpdate(connection, requestId);
            if (!request) throw new Error("Không tìm thấy yêu cầu");
            if (request.LoaiYeuCau !== "MUON") throw new Error("Đây không phải yêu cầu mượn sách");
            if (request.TrangThai !== "DA_DUYET") throw new Error("Chỉ được xác nhận lấy sách cho yêu cầu đã duyệt");
            await this.#assertEmployeeExists(connection, employeeId);
            // Legacy approvals already created a loan and deducted stock.
            if (request.MaMT) {
                await connection.query("UPDATE yeucaumuontra SET TrangThai = 'DA_LAY' WHERE MaYC = ?", [requestId]);
                await connection.commit();
                return await this.getById(requestId);
            }
            await this.#assertReaderCanRequestBorrow(connection, request.MaDG, requestId);
            const details = await this.#getBorrowRequestDetails(connection, requestId);
            const loanId = await this.#getNextLoanId(connection);
            await this.#assertBorrowBooksAvailable(connection, details);
            await this.#createLoanFromRequest(connection, {
                loanId,
                readerId: request.MaDG,
                employeeId,
                borrowDate,
                dueDate
            });
            await this.#saveLoanDetailsAndReduceStock(connection, loanId, details);
            await this.#approveBorrowRequest(connection, requestId, loanId, employeeId);
            await connection.commit();
            return await this.getById(requestId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async reject(requestId, reason, employeeId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const request = await this.#getForUpdate(connection, requestId);
            if (!request || request.LoaiYeuCau !== "MUON") throw new Error("Không tìm thấy yêu cầu");
            if (request.TrangThai !== "CHO_DUYET") throw new Error("Yêu cầu đã được xử lý");
            await this.#assertEmployeeExists(connection, employeeId);
            await connection.query(`
                UPDATE yeucaumuontra
                SET TrangThai = 'TU_CHOI', LyDoTuChoi = ?, NgayXuLy = NOW(), MaNVXuLy = ?
                WHERE MaYC = ?
            `, [reason, employeeId, requestId]);
            await connection.commit();
            return await this.getById(requestId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async #insertBorrowRequestDetails(connection, requestId, details) {
        for (const detail of details) {
            await connection.query(`
                INSERT INTO chitietyeucaumuon (MaYC, MaSach, SoLuong)
                VALUES (?, ?, ?)
            `, [requestId, String(detail.MaSach).trim(), Number(detail.SoLuong)]);
        }
    }

    async #getBorrowRequestForApproval(connection, requestId) {
        const request = await this.#getForUpdate(connection, requestId);

        if (!request) throw new Error("Không tìm thấy yêu cầu");
        if (request.LoaiYeuCau !== "MUON") throw new Error("Đây không phải yêu cầu mượn sách");
        if (request.TrangThai !== "CHO_DUYET") throw new Error("Yêu cầu đã được xử lý");

        return request;
    }

    async #getBorrowRequestDetails(connection, requestId) {
        const [details] = await connection.query(
            "SELECT MaSach, SoLuong FROM chitietyeucaumuon WHERE MaYC = ? FOR UPDATE",
            [requestId]
        );

        if (!details.length) {
            throw new Error("Yêu cầu mượn không có sách");
        }

        return details;
    }

    async #getNextLoanId(connection) {
        const [loans] = await connection.query(
            "SELECT MaMT FROM muontra WHERE MaMT REGEXP '^MT[0-9]+$' FOR UPDATE"
        );
        return buildNextLoanId(loans.map((loan) => loan.MaMT));
    }

    async #assertBorrowBooksAvailable(connection, details) {
        for (const detail of details) {
            const [books] = await connection.query(
                "SELECT MaSach, TenSach, SoLuong FROM sach WHERE MaSach = ? FOR UPDATE",
                [detail.MaSach]
            );
            const book = books[0];

            if (!book) throw new Error(`Sách ${detail.MaSach} không tồn tại`);
            if (Number(book.SoLuong) < Number(detail.SoLuong)) {
                throw new Error(`Sách ${book.TenSach} không đủ số lượng`);
            }
        }
    }

    async #createLoanFromRequest(connection, loan) {
        await connection.query(`
            INSERT INTO muontra (MaMT, MaDG, MaNV, NgayMuon, HanTra, NgayTra, TrangThai)
            VALUES (?, ?, ?, ?, ?, NULL, 'Đang mượn')
        `, [loan.loanId, loan.readerId, loan.employeeId, loan.borrowDate, loan.dueDate]);
    }

    async #saveLoanDetailsAndReduceStock(connection, loanId, details) {
        for (const detail of details) {
            await connection.query(
                "INSERT INTO chitietmuontra (MaMT, MaSach, SoLuong) VALUES (?, ?, ?)",
                [loanId, detail.MaSach, detail.SoLuong]
            );
            await connection.query(
                "UPDATE sach SET SoLuong = SoLuong - ? WHERE MaSach = ?",
                [detail.SoLuong, detail.MaSach]
            );
        }
    }

    async #approveBorrowRequest(connection, requestId, loanId, employeeId) {
        await connection.query(`
            UPDATE yeucaumuontra
            SET MaMT = ?, TrangThai = 'DA_DUYET', NgayXuLy = NOW(), MaNVXuLy = ?
            WHERE MaYC = ?
        `, [loanId, employeeId, requestId]);
    }

    async #getForUpdate(connection, requestId) {
        const [rows] = await connection.query(
            "SELECT MaYC, LoaiYeuCau, MaDG, MaMT, TrangThai FROM yeucaumuontra WHERE MaYC = ? FOR UPDATE",
            [requestId]
        );
        return rows[0];
    }

    async #assertReaderExists(connection, readerId) {
        const [rows] = await connection.query("SELECT MaDG FROM docgia WHERE MaDG = ? FOR UPDATE", [readerId]);
        if (!rows[0]) throw new Error("Độc giả không tồn tại");
    }

    async #assertEmployeeExists(connection, employeeId) {
        const [rows] = await connection.query("SELECT MaNV FROM nhanvien WHERE MaNV = ?", [employeeId]);
        if (!rows[0]) throw new Error("Nhân viên không tồn tại");
    }

    async #assertReaderCanRequestBorrow(connection, readerId, excludedRequestId = null) {
        const [cards] = await connection.query(`
            SELECT MaThe FROM thethuvien
            WHERE MaDG = ? AND NgayCap <= CURDATE() AND NgayHetHan >= CURDATE()
            LIMIT 1 FOR UPDATE
        `, [readerId]);
        if (!cards[0]) throw new Error("Thẻ thư viện không còn hiệu lực");

        const [loans] = await connection.query(
            "SELECT MaMT FROM muontra WHERE MaDG = ? AND NgayTra IS NULL LIMIT 1 FOR UPDATE",
            [readerId]
        );
        if (loans[0]) throw new Error("Độc giả đang có phiếu mượn chưa trả");

        const params = excludedRequestId ? [readerId, excludedRequestId] : [readerId];
        const exclusion = excludedRequestId ? "AND MaYC <> ?" : "";
        const [requests] = await connection.query(`
            SELECT MaYC FROM yeucaumuontra
            WHERE MaDG = ? AND LoaiYeuCau = 'MUON' AND TrangThai IN ('CHO_DUYET', 'DA_DUYET') ${exclusion}
            LIMIT 1 FOR UPDATE
        `, params);
        if (requests[0]) throw new Error("Độc giả đã có yêu cầu mượn đang chờ duyệt hoặc chờ lấy sách");
    }

    async #assertBooksAvailable(connection, details) {
        for (const detail of details) {
            const [books] = await connection.query(
                "SELECT MaSach, TenSach, SoLuong FROM sach WHERE MaSach = ? FOR UPDATE",
                [String(detail.MaSach).trim()]
            );
            const book = books[0];
            if (!book) throw new Error(`Sách ${detail.MaSach} không tồn tại`);
            if (Number(book.SoLuong) < Number(detail.SoLuong)) {
                throw new Error(`Sách ${book.TenSach} hiện không đủ số lượng`);
            }
        }
    }

    async #attachDetails(requests) {
        const borrowIds = requests.map((request) => request.MaYC);
        if (!borrowIds.length) return requests.map((request) => ({ ...request, ChiTiet: [] }));
        const [details] = await db.query(`
            SELECT ct.MaYC, ct.MaSach, s.TenSach, ct.SoLuong
            FROM chitietyeucaumuon ct
            LEFT JOIN sach s ON s.MaSach = ct.MaSach
            WHERE ct.MaYC IN (?)
            ORDER BY s.TenSach, ct.MaSach
        `, [borrowIds]);
        const byRequest = new Map();
        details.forEach((detail) => {
            const current = byRequest.get(String(detail.MaYC)) || [];
            current.push(detail);
            byRequest.set(String(detail.MaYC), current);
        });
        return requests.map((request) => ({
            ...request,
            ChiTiet: byRequest.get(String(request.MaYC)) || []
        }));
    }
}

module.exports = new YeuCauMuonTraRepository();
module.exports.buildNextLoanId = buildNextLoanId;
