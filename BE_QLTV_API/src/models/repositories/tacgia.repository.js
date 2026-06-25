const db = require("../../config/db");

class TacGiaRepository {
    async getAll() {
        const sql = "SELECT MaTG, TenTG, NamSinh, GioiTinh, QuocTich FROM tacgia ORDER BY MaTG";
        const [rows] = await db.query(sql);

        return rows;
    }

    async getById(maTG) {
        const sql = "SELECT MaTG, TenTG, NamSinh, GioiTinh, QuocTich FROM tacgia WHERE MaTG = ?";
        const [rows] = await db.query(sql, [maTG]);

        return rows[0];
    }

    async search(keyword) {
        const sql = `
            SELECT MaTG, TenTG, NamSinh, GioiTinh, QuocTich
            FROM tacgia
            WHERE MaTG LIKE ?
                OR TenTG LIKE ?
                OR NamSinh LIKE ?
                OR GioiTinh LIKE ?
                OR QuocTich LIKE ?
            ORDER BY MaTG
        `;
        const searchValue = `%${keyword}%`;
        const values = Array(5).fill(searchValue);
        const [rows] = await db.query(sql, values);

        return rows;
    }

    async getStatistics() {
        const [summaryRows] = await db.query("SELECT COUNT(MaTG) AS TongTacGia FROM tacgia");
        const [bookRows] = await db.query(`
            SELECT
                tg.MaTG,
                tg.TenTG,
                COUNT(s.MaSach) AS TongDauSach,
                COALESCE(SUM(s.SoLuong), 0) AS TongSoLuong
            FROM tacgia tg
            LEFT JOIN sach s ON tg.MaTG = s.MaTG
            GROUP BY tg.MaTG, tg.TenTG
            ORDER BY TongDauSach DESC, tg.MaTG
        `);

        return {
            tongQuan: summaryRows[0],
            sachTheoTacGia: bookRows
        };
    }

    async create(tacGia) {
        const sql = `
            INSERT INTO tacgia
            (MaTG, TenTG, NamSinh, GioiTinh, QuocTich)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            tacGia.getMaTG(),
            tacGia.getTenTG(),
            tacGia.getNamSinh(),
            tacGia.getGioiTinh(),
            tacGia.getQuocTich()
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them tac gia");
        }

        return tacGia.toObject();
    }

    async update(maTG, tacGia) {
        const sql = `
            UPDATE tacgia
            SET TenTG = ?, NamSinh = ?, GioiTinh = ?, QuocTich = ?
            WHERE MaTG = ?
        `;
        const values = [
            tacGia.getTenTG(),
            tacGia.getNamSinh(),
            tacGia.getGioiTinh(),
            tacGia.getQuocTich(),
            maTG
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the cap nhat tac gia");
        }

        return {
            MaTG: maTG,
            TenTG: tacGia.getTenTG(),
            NamSinh: tacGia.getNamSinh(),
            GioiTinh: tacGia.getGioiTinh(),
            QuocTich: tacGia.getQuocTich()
        };
    }

    async delete(maTG) {
        const sql = "DELETE FROM tacgia WHERE MaTG = ?";
        const [result] = await db.query(sql, [maTG]);

        return result.affectedRows > 0;
    }
}

module.exports = new TacGiaRepository();
