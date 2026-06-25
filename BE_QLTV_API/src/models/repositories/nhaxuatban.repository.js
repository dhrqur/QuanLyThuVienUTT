const db = require("../../config/db");

class NhaXuatBanRepository {
    async getAll() {
        const sql = "SELECT MaNXB, TenNXB, DiaChi, Email, Sdt FROM nhaxuatban ORDER BY MaNXB";
        const [rows] = await db.query(sql);

        return rows;
    }

    async getById(maNXB) {
        const sql = "SELECT MaNXB, TenNXB, DiaChi, Email, Sdt FROM nhaxuatban WHERE MaNXB = ?";
        const [rows] = await db.query(sql, [maNXB]);

        return rows[0];
    }

    async search(keyword) {
        const sql = `
            SELECT MaNXB, TenNXB, DiaChi, Email, Sdt
            FROM nhaxuatban
            WHERE MaNXB LIKE ?
                OR TenNXB LIKE ?
                OR DiaChi LIKE ?
                OR Email LIKE ?
                OR Sdt LIKE ?
            ORDER BY MaNXB
        `;
        const searchValue = `%${keyword}%`;
        const values = Array(5).fill(searchValue);
        const [rows] = await db.query(sql, values);

        return rows;
    }

    async getStatistics() {
        const [summaryRows] = await db.query("SELECT COUNT(MaNXB) AS TongNhaXuatBan FROM nhaxuatban");
        const [bookRows] = await db.query(`
            SELECT
                nxb.MaNXB,
                nxb.TenNXB,
                COUNT(s.MaSach) AS TongDauSach,
                COALESCE(SUM(s.SoLuong), 0) AS TongSoLuong
            FROM nhaxuatban nxb
            LEFT JOIN sach s ON nxb.MaNXB = s.MaNXB
            GROUP BY nxb.MaNXB, nxb.TenNXB
            ORDER BY TongDauSach DESC, nxb.MaNXB
        `);

        return {
            tongQuan: summaryRows[0],
            sachTheoNhaXuatBan: bookRows
        };
    }

    async create(nhaXuatBan) {
        const sql = `
            INSERT INTO nhaxuatban
            (MaNXB, TenNXB, DiaChi, Email, Sdt)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            nhaXuatBan.getMaNXB(),
            nhaXuatBan.getTenNXB(),
            nhaXuatBan.getDiaChi(),
            nhaXuatBan.getEmail(),
            nhaXuatBan.getSdt()
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them nha xuat ban");
        }

        return nhaXuatBan.toObject();
    }

    async update(maNXB, nhaXuatBan) {
        const sql = `
            UPDATE nhaxuatban
            SET TenNXB = ?, DiaChi = ?, Email = ?, Sdt = ?
            WHERE MaNXB = ?
        `;
        const values = [
            nhaXuatBan.getTenNXB(),
            nhaXuatBan.getDiaChi(),
            nhaXuatBan.getEmail(),
            nhaXuatBan.getSdt(),
            maNXB
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the cap nhat nha xuat ban");
        }

        return {
            MaNXB: maNXB,
            TenNXB: nhaXuatBan.getTenNXB(),
            DiaChi: nhaXuatBan.getDiaChi(),
            Email: nhaXuatBan.getEmail(),
            Sdt: nhaXuatBan.getSdt()
        };
    }

    async delete(maNXB) {
        const sql = "DELETE FROM nhaxuatban WHERE MaNXB = ?";
        const [result] = await db.query(sql, [maNXB]);

        return result.affectedRows > 0;
    }
}

module.exports = new NhaXuatBanRepository();
