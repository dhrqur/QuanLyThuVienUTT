const db = require("../../config/db");

const SACH_COLUMNS = "MaSach, MaTG, MaNXB, MaTL, TenSach, NamXB, SoLuong, MaNN, MaViTri";

class SachRepository {
    async getAll() {
        const sql = `SELECT ${SACH_COLUMNS} FROM sach ORDER BY MaSach`;
        const [rows] = await db.query(sql);

        return rows;
    }

    async getById(maSach) {
        const sql = `SELECT ${SACH_COLUMNS} FROM sach WHERE MaSach = ?`;
        const [rows] = await db.query(sql, [maSach]);

        return rows[0];
    }

    async search(keyword) {
        const sql = `
            SELECT
                s.MaSach,
                s.MaTG,
                tg.TenTG,
                s.MaNXB,
                nxb.TenNXB,
                s.MaTL,
                tl.TenTL,
                s.TenSach,
                s.NamXB,
                s.SoLuong,
                s.MaNN,
                nn.TenNN,
                s.MaViTri,
                ks.TenKe
            FROM sach s
            LEFT JOIN tacgia tg ON s.MaTG = tg.MaTG
            LEFT JOIN nhaxuatban nxb ON s.MaNXB = nxb.MaNXB
            LEFT JOIN theloai tl ON s.MaTL = tl.MaTL
            LEFT JOIN ngonngu nn ON s.MaNN = nn.MaNN
            LEFT JOIN kesach ks ON s.MaViTri = ks.MaViTri
            WHERE s.MaSach LIKE ?
                OR s.TenSach LIKE ?
                OR s.NamXB LIKE ?
                OR s.MaTG LIKE ?
                OR tg.TenTG LIKE ?
                OR s.MaNXB LIKE ?
                OR nxb.TenNXB LIKE ?
                OR s.MaTL LIKE ?
                OR tl.TenTL LIKE ?
                OR s.MaNN LIKE ?
                OR nn.TenNN LIKE ?
                OR s.MaViTri LIKE ?
                OR ks.TenKe LIKE ?
            ORDER BY s.MaSach
        `;
        const searchValue = `%${keyword}%`;
        const values = Array(13).fill(searchValue);
        const [rows] = await db.query(sql, values);

        return rows;
    }

    async getStatistics() {
        const [summaryRows] = await db.query(`
            SELECT
                COUNT(MaSach) AS TongDauSach,
                COALESCE(SUM(SoLuong), 0) AS TongSoLuong,
                SUM(CASE WHEN SoLuong > 0 THEN 1 ELSE 0 END) AS SoDauSachCon,
                SUM(CASE WHEN SoLuong IS NULL OR SoLuong <= 0 THEN 1 ELSE 0 END) AS SoDauSachHet
            FROM sach
        `);

        const [categoryRows] = await db.query(`
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

        const [lowStockRows] = await db.query(`
            SELECT MaSach, TenSach, SoLuong
            FROM sach
            WHERE SoLuong IS NULL OR SoLuong <= 5
            ORDER BY SoLuong ASC, MaSach
        `);

        return {
            tongQuan: summaryRows[0],
            theoTheLoai: categoryRows,
            sachSapHet: lowStockRows
        };
    }

    async create(sach) {
        const sql = `
            INSERT INTO sach
            (MaSach, MaTG, MaNXB, MaTL, TenSach, NamXB, SoLuong, MaNN, MaViTri)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            sach.getMaSach(),
            sach.getMaTG(),
            sach.getMaNXB(),
            sach.getMaTL(),
            sach.getTenSach(),
            sach.getNamXB(),
            sach.getSoLuong(),
            sach.getMaNN(),
            sach.getMaViTri()
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them sach");
        }

        return sach.toObject();
    }

    async update(maSach, sach) {
        const sql = `
            UPDATE sach
            SET MaTG = ?, MaNXB = ?, MaTL = ?, TenSach = ?, NamXB = ?, SoLuong = ?, MaNN = ?, MaViTri = ?
            WHERE MaSach = ?
        `;

        const values = [
            sach.getMaTG(),
            sach.getMaNXB(),
            sach.getMaTL(),
            sach.getTenSach(),
            sach.getNamXB(),
            sach.getSoLuong(),
            sach.getMaNN(),
            sach.getMaViTri(),
            maSach
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the cap nhat sach");
        }

        return {
            MaSach: maSach,
            MaTG: sach.getMaTG(),
            MaNXB: sach.getMaNXB(),
            MaTL: sach.getMaTL(),
            TenSach: sach.getTenSach(),
            NamXB: sach.getNamXB(),
            SoLuong: sach.getSoLuong(),
            MaNN: sach.getMaNN(),
            MaViTri: sach.getMaViTri()
        };
    }

    async delete(maSach) {
        const sql = "DELETE FROM sach WHERE MaSach = ?";
        const [result] = await db.query(sql, [maSach]);

        return result.affectedRows > 0;
    }
}

module.exports = new SachRepository();
