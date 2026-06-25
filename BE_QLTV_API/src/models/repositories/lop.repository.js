const db = require("../../config/db");

class LopRepository {
    async getAll() {
        const sql = "SELECT MaLop, TenLop, MaKhoa FROM lop ORDER BY MaLop";
        const [rows] = await db.query(sql);

        return rows;
    }

    async getById(maLop) {
        const sql = "SELECT MaLop, TenLop, MaKhoa FROM lop WHERE MaLop = ?";
        const [rows] = await db.query(sql, [maLop]);

        return rows[0];
    }

    async search(keyword) {
        const sql = `
            SELECT MaLop, TenLop, MaKhoa
            FROM lop
            WHERE MaLop LIKE ?
                OR TenLop LIKE ?
                OR MaKhoa LIKE ?
            ORDER BY MaLop
        `;
        const searchValue = `%${keyword}%`;
        const values = Array(3).fill(searchValue);
        const [rows] = await db.query(sql, values);

        return rows;
    }

    async getStatistics() {
        const [summaryRows] = await db.query("SELECT COUNT(MaLop) AS TongLop FROM lop");
        const [rows] = await db.query(`
            SELECT
                l.MaLop,
                l.TenLop,
                l.MaKhoa,
                k.TenKhoa,
                COUNT(dg.MaDG) AS TongDocGia
            FROM lop l
            LEFT JOIN khoa k ON l.MaKhoa = k.MaKhoa
            LEFT JOIN docgia dg ON l.MaLop = dg.MaLop
            GROUP BY l.MaLop, l.TenLop, l.MaKhoa, k.TenKhoa
            ORDER BY TongDocGia DESC, l.MaLop
        `);

        return {
            tongQuan: summaryRows[0],
            docGiaTheoLop: rows
        };
    }

    async create(lop) {
        const sql = `
            INSERT INTO lop
            (MaLop, TenLop, MaKhoa)
            VALUES (?, ?, ?)
        `;
        const values = [
            lop.getMaLop(),
            lop.getTenLop(),
            lop.getMaKhoa()
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them lop");
        }

        return lop.toObject();
    }

    async update(maLop, lop) {
        const sql = `
            UPDATE lop
            SET TenLop = ?, MaKhoa = ?
            WHERE MaLop = ?
        `;
        const values = [
            lop.getTenLop(),
            lop.getMaKhoa(),
            maLop
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the cap nhat lop");
        }

        return {
            MaLop: maLop,
            TenLop: lop.getTenLop(),
            MaKhoa: lop.getMaKhoa()
        };
    }

    async delete(maLop) {
        const sql = "DELETE FROM lop WHERE MaLop = ?";
        const [result] = await db.query(sql, [maLop]);

        return result.affectedRows > 0;
    }
}

module.exports = new LopRepository();
