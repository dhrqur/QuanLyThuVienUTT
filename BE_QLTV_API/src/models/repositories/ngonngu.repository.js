const db = require("../../config/db");

class NgonNguRepository {
    async getAll() {
        const sql = "SELECT MaNN, TenNN FROM ngonngu ORDER BY MaNN";
        const [rows] = await db.query(sql);

        return rows;
    }

    async getById(maNN) {
        const sql = "SELECT MaNN, TenNN FROM ngonngu WHERE MaNN = ?";
        const [rows] = await db.query(sql, [maNN]);

        return rows[0];
    }

    async search(keyword) {
        const sql = `
            SELECT MaNN, TenNN
            FROM ngonngu
            WHERE MaNN LIKE ?
                OR TenNN LIKE ?
            ORDER BY MaNN
        `;
        const searchValue = `%${keyword}%`;
        const values = Array(2).fill(searchValue);
        const [rows] = await db.query(sql, values);

        return rows;
    }

    async getStatistics() {
        const [summaryRows] = await db.query("SELECT COUNT(MaNN) AS TongNgonNgu FROM ngonngu");
        const [bookRows] = await db.query(`
            SELECT
                nn.MaNN,
                nn.TenNN,
                COUNT(s.MaSach) AS TongDauSach,
                COALESCE(SUM(s.SoLuong), 0) AS TongSoLuong
            FROM ngonngu nn
            LEFT JOIN sach s ON nn.MaNN = s.MaNN
            GROUP BY nn.MaNN, nn.TenNN
            ORDER BY nn.MaNN
        `);

        return {
            tongQuan: summaryRows[0],
            sachTheoNgonNgu: bookRows
        };
    }

    async create(ngonNgu) {
        const sql = `
            INSERT INTO ngonngu
            (MaNN, TenNN)
            VALUES (?, ?)
        `;
        const values = [
            ngonNgu.getMaNN(),
            ngonNgu.getTenNN()
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them ngon ngu");
        }

        return ngonNgu.toObject();
    }

    async update(maNN, ngonNgu) {
        const sql = `
            UPDATE ngonngu
            SET TenNN = ?
            WHERE MaNN = ?
        `;
        const values = [
            ngonNgu.getTenNN(),
            maNN
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the cap nhat ngon ngu");
        }

        return {
            MaNN: maNN,
            TenNN: ngonNgu.getTenNN()
        };
    }

    async delete(maNN) {
        const sql = "DELETE FROM ngonngu WHERE MaNN = ?";
        const [result] = await db.query(sql, [maNN]);

        return result.affectedRows > 0;
    }
}

module.exports = new NgonNguRepository();
