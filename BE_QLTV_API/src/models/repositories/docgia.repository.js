const db = require("../../config/db");

const DOCGIA_COLUMNS = `
    dg.MaDG,
    dg.MaKhoa,
    k.TenKhoa,
    dg.MaLop,
    l.TenLop,
    dg.TenDG,
    dg.NamSinh,
    dg.GioiTinh,
    dg.DiaChi,
    dg.Email,
    dg.Sdt
`;

class DocGiaRepository {
    async getAll() {
        const sql = `
            SELECT ${DOCGIA_COLUMNS}
            FROM docgia dg
            LEFT JOIN khoa k ON dg.MaKhoa = k.MaKhoa
            LEFT JOIN lop l ON dg.MaLop = l.MaLop
            ORDER BY dg.MaDG
        `;
        const [rows] = await db.query(sql);

        return rows;
    }

    async getById(maDG) {
        const sql = `
            SELECT ${DOCGIA_COLUMNS}
            FROM docgia dg
            LEFT JOIN khoa k ON dg.MaKhoa = k.MaKhoa
            LEFT JOIN lop l ON dg.MaLop = l.MaLop
            WHERE dg.MaDG = ?
        `;
        const [rows] = await db.query(sql, [maDG]);

        return rows[0];
    }

    async search(keyword) {
        const sql = `
            SELECT ${DOCGIA_COLUMNS}
            FROM docgia dg
            LEFT JOIN khoa k ON dg.MaKhoa = k.MaKhoa
            LEFT JOIN lop l ON dg.MaLop = l.MaLop
            WHERE dg.MaDG LIKE ?
                OR dg.MaKhoa LIKE ?
                OR k.TenKhoa LIKE ?
                OR dg.MaLop LIKE ?
                OR l.TenLop LIKE ?
                OR dg.TenDG LIKE ?
                OR dg.NamSinh LIKE ?
                OR dg.GioiTinh LIKE ?
                OR dg.DiaChi LIKE ?
                OR dg.Email LIKE ?
                OR dg.Sdt LIKE ?
            ORDER BY dg.MaDG
        `;
        const searchValue = `%${keyword}%`;
        const values = Array(11).fill(searchValue);
        const [rows] = await db.query(sql, values);

        return rows;
    }

    async getStatistics() {
        const [summaryRows] = await db.query("SELECT COUNT(MaDG) AS TongDocGia FROM docgia");
        const [facultyRows] = await db.query(`
            SELECT
                dg.MaKhoa,
                k.TenKhoa,
                COUNT(dg.MaDG) AS TongDocGia
            FROM docgia dg
            LEFT JOIN khoa k ON dg.MaKhoa = k.MaKhoa
            GROUP BY dg.MaKhoa, k.TenKhoa
            ORDER BY TongDocGia DESC, dg.MaKhoa
        `);
        const [genderRows] = await db.query(`
            SELECT GioiTinh, COUNT(MaDG) AS SoLuong
            FROM docgia
            GROUP BY GioiTinh
            ORDER BY GioiTinh
        `);

        return {
            tongQuan: summaryRows[0],
            theoKhoa: facultyRows,
            theoGioiTinh: genderRows
        };
    }

    async create(docGia) {
        const sql = `
            INSERT INTO docgia
            (MaDG, MaKhoa, MaLop, TenDG, NamSinh, GioiTinh, DiaChi, Email, Sdt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            docGia.getMaDG(),
            docGia.getMaKhoa(),
            docGia.getMaLop(),
            docGia.getTenDG(),
            docGia.getNamSinh(),
            docGia.getGioiTinh(),
            docGia.getDiaChi(),
            docGia.getEmail(),
            docGia.getSdt()
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them doc gia");
        }

        return docGia.toObject();
    }

    async update(maDG, docGia) {
        const sql = `
            UPDATE docgia
            SET MaKhoa = ?, MaLop = ?, TenDG = ?, NamSinh = ?, GioiTinh = ?, DiaChi = ?, Email = ?, Sdt = ?
            WHERE MaDG = ?
        `;
        const values = [
            docGia.getMaKhoa(),
            docGia.getMaLop(),
            docGia.getTenDG(),
            docGia.getNamSinh(),
            docGia.getGioiTinh(),
            docGia.getDiaChi(),
            docGia.getEmail(),
            docGia.getSdt(),
            maDG
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the cap nhat doc gia");
        }

        return {
            MaDG: maDG,
            MaKhoa: docGia.getMaKhoa(),
            MaLop: docGia.getMaLop(),
            TenDG: docGia.getTenDG(),
            NamSinh: docGia.getNamSinh(),
            GioiTinh: docGia.getGioiTinh(),
            DiaChi: docGia.getDiaChi(),
            Email: docGia.getEmail(),
            Sdt: docGia.getSdt()
        };
    }

    async delete(maDG) {
        const sql = "DELETE FROM docgia WHERE MaDG = ?";
        const [result] = await db.query(sql, [maDG]);

        return result.affectedRows > 0;
    }
}

module.exports = new DocGiaRepository();
