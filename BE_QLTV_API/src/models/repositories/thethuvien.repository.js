const db = require("../../config/db");

const cardStatusSql = `
    CASE
        WHEN NgayHetHan < CURDATE() THEN 'Hết hạn'
        ELSE 'Còn hiệu lực'
    END
`;

class TheThuVienRepository {
    async getAll() {
        const sql = `
            SELECT MaThe, MaDG, NgayCap, NgayHetHan, ${cardStatusSql} AS TrangThai
            FROM thethuvien
            ORDER BY MaThe
        `;
        const [rows] = await db.query(sql);

        return rows;
    }

    async getById(maThe) {
        const sql = `
            SELECT MaThe, MaDG, NgayCap, NgayHetHan, ${cardStatusSql} AS TrangThai
            FROM thethuvien
            WHERE MaThe = ?
        `;
        const [rows] = await db.query(sql, [maThe]);

        return rows[0];
    }

    async search(keyword) {
        const sql = `
            SELECT MaThe, MaDG, NgayCap, NgayHetHan, ${cardStatusSql} AS TrangThai
            FROM thethuvien
            WHERE MaThe LIKE ?
                OR MaDG LIKE ?
                OR NgayCap LIKE ?
                OR NgayHetHan LIKE ?
                OR ${cardStatusSql} LIKE ?
            ORDER BY MaThe
        `;
        const searchValue = `%${keyword}%`;
        const values = Array(5).fill(searchValue);
        const [rows] = await db.query(sql, values);

        return rows;
    }

    async getStatistics() {
        const [summaryRows] = await db.query("SELECT COUNT(MaThe) AS TongTheThuVien FROM thethuvien");
        const [statusRows] = await db.query(`
            SELECT ${cardStatusSql} AS TrangThai, COUNT(MaThe) AS SoLuong
            FROM thethuvien
            GROUP BY ${cardStatusSql}
            ORDER BY TrangThai
        `);
        const [expiredRows] = await db.query(`
            SELECT
                SUM(CASE WHEN NgayHetHan < CURDATE() THEN 1 ELSE 0 END) AS TheQuaHan,
                SUM(CASE WHEN NgayHetHan >= CURDATE() THEN 1 ELSE 0 END) AS TheConHan
            FROM thethuvien
        `);

        return {
            tongQuan: summaryRows[0],
            theoTrangThai: statusRows,
            hanThe: expiredRows[0]
        };
    }

    async create(theThuVien) {
        const sql = `
            INSERT INTO thethuvien
            (MaThe, MaDG, NgayCap, NgayHetHan, TrangThai)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            theThuVien.getMaThe(),
            theThuVien.getMaDG(),
            theThuVien.getNgayCap(),
            theThuVien.getNgayHetHan(),
            theThuVien.getTrangThai()
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them the thu vien");
        }

        return theThuVien.toObject();
    }

    async update(maThe, theThuVien) {
        const sql = `
            UPDATE thethuvien
            SET MaDG = ?, NgayCap = ?, NgayHetHan = ?, TrangThai = ?
            WHERE MaThe = ?
        `;
        const values = [
            theThuVien.getMaDG(),
            theThuVien.getNgayCap(),
            theThuVien.getNgayHetHan(),
            theThuVien.getTrangThai(),
            maThe
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the cap nhat the thu vien");
        }

        return {
            MaThe: maThe,
            MaDG: theThuVien.getMaDG(),
            NgayCap: theThuVien.getNgayCap(),
            NgayHetHan: theThuVien.getNgayHetHan(),
            TrangThai: theThuVien.getTrangThai()
        };
    }

    async delete(maThe) {
        const sql = "DELETE FROM thethuvien WHERE MaThe = ?";
        const [result] = await db.query(sql, [maThe]);

        return result.affectedRows > 0;
    }
}

module.exports = new TheThuVienRepository();
