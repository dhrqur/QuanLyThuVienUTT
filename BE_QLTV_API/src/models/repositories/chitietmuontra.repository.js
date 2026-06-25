const db = require("../../config/db");

class ChiTietMuonTraRepository {
    async getAll() {
        const sql = "SELECT MaMT, MaSach, SoLuong FROM chitietmuontra ORDER BY MaMT, MaSach";
        const [rows] = await db.query(sql);

        return rows;
    }

    async getById(maMT, maSach) {
        const sql = "SELECT MaMT, MaSach, SoLuong FROM chitietmuontra WHERE MaMT = ? AND MaSach = ?";
        const [rows] = await db.query(sql, [maMT, maSach]);

        return rows[0];
    }

    async search(keyword) {
        const sql = `
            SELECT MaMT, MaSach, SoLuong
            FROM chitietmuontra
            WHERE MaMT LIKE ?
                OR MaSach LIKE ?
                OR SoLuong LIKE ?
            ORDER BY MaMT, MaSach
        `;
        const searchValue = `%${keyword}%`;
        const values = Array(3).fill(searchValue);
        const [rows] = await db.query(sql, values);

        return rows;
    }

    async getStatistics() {
        const [summaryRows] = await db.query(`
            SELECT
                COUNT(*) AS TongDongChiTiet,
                COALESCE(SUM(SoLuong), 0) AS TongSoLuongMuon
            FROM chitietmuontra
        `);
        const [bookRows] = await db.query(`
            SELECT
                ct.MaSach,
                s.TenSach,
                COALESCE(SUM(ct.SoLuong), 0) AS TongSoLuongMuon
            FROM chitietmuontra ct
            LEFT JOIN sach s ON ct.MaSach = s.MaSach
            GROUP BY ct.MaSach, s.TenSach
            ORDER BY TongSoLuongMuon DESC, ct.MaSach
        `);

        return {
            tongQuan: summaryRows[0],
            theoSach: bookRows
        };
    }

    async create(chiTietMuonTra) {
        const sql = `
            INSERT INTO chitietmuontra
            (MaMT, MaSach, SoLuong)
            VALUES (?, ?, ?)
        `;
        const values = [
            chiTietMuonTra.getMaMT(),
            chiTietMuonTra.getMaSach(),
            chiTietMuonTra.getSoLuong()
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them chi tiet muon tra");
        }

        return chiTietMuonTra.toObject();
    }

    async update(maMT, maSach, chiTietMuonTra) {
        const sql = `
            UPDATE chitietmuontra
            SET SoLuong = ?
            WHERE MaMT = ? AND MaSach = ?
        `;
        const values = [
            chiTietMuonTra.getSoLuong(),
            maMT,
            maSach
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the cap nhat chi tiet muon tra");
        }

        return {
            MaMT: maMT,
            MaSach: maSach,
            SoLuong: chiTietMuonTra.getSoLuong()
        };
    }

    async delete(maMT, maSach) {
        const sql = "DELETE FROM chitietmuontra WHERE MaMT = ? AND MaSach = ?";
        const [result] = await db.query(sql, [maMT, maSach]);

        return result.affectedRows > 0;
    }
}

module.exports = new ChiTietMuonTraRepository();
