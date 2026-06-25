const db = require("../../config/db");

class TheLoaiRepository {
    async getAll() {
        const sql = "SELECT MaTL, TenTL FROM theloai ORDER BY MaTL";
        const [rows] = await db.query(sql);

        return rows;
    }

    async getById(maTL) {
        const sql = "SELECT MaTL, TenTL FROM theloai WHERE MaTL = ?";
        const [rows] = await db.query(sql, [maTL]);

        return rows[0];
    }

    async search(keyword) {
        const sql = `
            SELECT MaTL, TenTL
            FROM theloai
            WHERE MaTL LIKE ?
                OR TenTL LIKE ?
            ORDER BY MaTL
        `;
        const searchValue = `%${keyword}%`;
        const [rows] = await db.query(sql, [searchValue, searchValue]);

        return rows;
    }

    async getStatistics() {
        const [summaryRows] = await db.query("SELECT COUNT(MaTL) AS TongTheLoai FROM theloai");
        const [bookRows] = await db.query(`
            SELECT
                tl.MaTL,
                tl.TenTL,
                COUNT(s.MaSach) AS TongDauSach,
                COALESCE(SUM(s.SoLuong), 0) AS TongSoLuong
            FROM theloai tl
            LEFT JOIN sach s ON tl.MaTL = s.MaTL
            GROUP BY tl.MaTL, tl.TenTL
            ORDER BY tl.MaTL
        `);

        return {
            tongQuan: summaryRows[0],
            sachTheoTheLoai: bookRows
        };
    }

    async create(theLoai) {
        const sql = "INSERT INTO theloai (MaTL, TenTL) VALUES (?, ?)";
        const values = [
            theLoai.getMaTL(),
            theLoai.getTenTL()
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them the loai");
        }

        return theLoai.toObject();
    }

    async update(maTL, theLoai) {
        const sql = "UPDATE theloai SET TenTL = ? WHERE MaTL = ?";
        const [result] = await db.query(sql, [
            theLoai.getTenTL(),
            maTL
        ]);

        if (result.affectedRows === 0) {
            throw new Error("Khong the cap nhat the loai");
        }

        return {
            MaTL: maTL,
            TenTL: theLoai.getTenTL()
        };
    }

    async delete(maTL) {
        const sql = "DELETE FROM theloai WHERE MaTL = ?";
        const [result] = await db.query(sql, [maTL]);

        return result.affectedRows > 0;
    }
}

module.exports = new TheLoaiRepository();
