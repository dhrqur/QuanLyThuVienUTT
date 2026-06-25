const db = require("../../config/db");

class KhoaRepository {
    async getAll() {
        const sql = "SELECT MaKhoa, TenKhoa FROM khoa ORDER BY MaKhoa";
        const [rows] = await db.query(sql);

        return rows;
    }

    async getById(maKhoa) {
        const sql = "SELECT MaKhoa, TenKhoa FROM khoa WHERE MaKhoa = ?";
        const [rows] = await db.query(sql, [maKhoa]);

        return rows[0];
    }

    async search(keyword) {
        const sql = `
            SELECT MaKhoa, TenKhoa
            FROM khoa
            WHERE MaKhoa LIKE ?
                OR TenKhoa LIKE ?
            ORDER BY MaKhoa
        `;
        const searchValue = `%${keyword}%`;
        const values = Array(2).fill(searchValue);
        const [rows] = await db.query(sql, values);

        return rows;
    }

    async getStatistics() {
        const [summaryRows] = await db.query("SELECT COUNT(MaKhoa) AS TongKhoa FROM khoa");
        const [rows] = await db.query(`
            SELECT
                k.MaKhoa,
                k.TenKhoa,
                COUNT(DISTINCT l.MaLop) AS TongLop,
                COUNT(DISTINCT dg.MaDG) AS TongDocGia
            FROM khoa k
            LEFT JOIN lop l ON k.MaKhoa = l.MaKhoa
            LEFT JOIN docgia dg ON k.MaKhoa = dg.MaKhoa
            GROUP BY k.MaKhoa, k.TenKhoa
            ORDER BY k.MaKhoa
        `);

        return {
            tongQuan: summaryRows[0],
            chiTiet: rows
        };
    }

    async create(khoa) {
        const sql = `
            INSERT INTO khoa
            (MaKhoa, TenKhoa)
            VALUES (?, ?)
        `;
        const values = [
            khoa.getMaKhoa(),
            khoa.getTenKhoa()
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them khoa");
        }

        return khoa.toObject();
    }

    async update(maKhoa, khoa) {
        const sql = `
            UPDATE khoa
            SET TenKhoa = ?
            WHERE MaKhoa = ?
        `;
        const values = [
            khoa.getTenKhoa(),
            maKhoa
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the cap nhat khoa");
        }

        return {
            MaKhoa: maKhoa,
            TenKhoa: khoa.getTenKhoa()
        };
    }

    async delete(maKhoa) {
        const sql = "DELETE FROM khoa WHERE MaKhoa = ?";
        const [result] = await db.query(sql, [maKhoa]);

        return result.affectedRows > 0;
    }
}

module.exports = new KhoaRepository();
