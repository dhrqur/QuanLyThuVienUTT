const db = require("../../config/db");

class KeSachRepository {
    async getAll() {
        const sql = "SELECT MaViTri, TenKe, MoTa FROM kesach ORDER BY MaViTri";
        const [rows] = await db.query(sql);

        return rows;
    }

    async getById(maViTri) {
        const sql = "SELECT MaViTri, TenKe, MoTa FROM kesach WHERE MaViTri = ?";
        const [rows] = await db.query(sql, [maViTri]);

        return rows[0];
    }

    async search(keyword) {
        const sql = `
            SELECT MaViTri, TenKe, MoTa
            FROM kesach
            WHERE MaViTri LIKE ?
                OR TenKe LIKE ?
                OR MoTa LIKE ?
            ORDER BY MaViTri
        `;
        const searchValue = `%${keyword}%`;
        const values = Array(3).fill(searchValue);
        const [rows] = await db.query(sql, values);

        return rows;
    }

    async getStatistics() {
        const [summaryRows] = await db.query("SELECT COUNT(MaViTri) AS TongKeSach FROM kesach");
        const [bookRows] = await db.query(`
            SELECT
                ks.MaViTri,
                ks.TenKe,
                COUNT(s.MaSach) AS TongDauSach,
                COALESCE(SUM(s.SoLuong), 0) AS TongSoLuong
            FROM kesach ks
            LEFT JOIN sach s ON ks.MaViTri = s.MaViTri
            GROUP BY ks.MaViTri, ks.TenKe
            ORDER BY ks.MaViTri
        `);

        return {
            tongQuan: summaryRows[0],
            sachTheoKe: bookRows
        };
    }

    async create(keSach) {
        const sql = `
            INSERT INTO kesach
            (MaViTri, TenKe, MoTa)
            VALUES (?, ?, ?)
        `;
        const values = [
            keSach.getMaViTri(),
            keSach.getTenKe(),
            keSach.getMoTa()
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them ke sach");
        }

        return keSach.toObject();
    }

    async update(maViTri, keSach) {
        const sql = `
            UPDATE kesach
            SET TenKe = ?, MoTa = ?
            WHERE MaViTri = ?
        `;
        const values = [
            keSach.getTenKe(),
            keSach.getMoTa(),
            maViTri
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the cap nhat ke sach");
        }

        return {
            MaViTri: maViTri,
            TenKe: keSach.getTenKe(),
            MoTa: keSach.getMoTa()
        };
    }

    async delete(maViTri) {
        const sql = "DELETE FROM kesach WHERE MaViTri = ?";
        const [result] = await db.query(sql, [maViTri]);

        return result.affectedRows > 0;
    }
}

module.exports = new KeSachRepository();
