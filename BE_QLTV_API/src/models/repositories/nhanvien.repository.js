const db = require("../../config/db");

const SAFE_COLUMNS = "`MaNV`, `TenNV`, `QueQuan`, `GioiTinh`, `NamSinh`, `VaiTro`, `Email`, `Sdt`, `User`";

class NhanVienRepository {
    async getAll() {
        const sql = `SELECT ${SAFE_COLUMNS} FROM nhanvien ORDER BY MaNV`;
        const [rows] = await db.query(sql);

        return rows;
    }

    async getById(maNV) {
        const sql = `SELECT ${SAFE_COLUMNS} FROM nhanvien WHERE MaNV = ?`;
        const [rows] = await db.query(sql, [maNV]);

        return rows[0];
    }

    async getByIdWithPassword(maNV) {
        const sql = "SELECT `MaNV`, `TenNV`, `QueQuan`, `GioiTinh`, `NamSinh`, `VaiTro`, `Email`, `Sdt`, `User`, `Pass` FROM nhanvien WHERE MaNV = ?";
        const [rows] = await db.query(sql, [maNV]);

        return rows[0];
    }

    async getByUser(user) {
        const sql = `SELECT ${SAFE_COLUMNS} FROM nhanvien WHERE \`User\` = ?`;
        const [rows] = await db.query(sql, [user]);

        return rows[0];
    }

    async getByUserWithPassword(user) {
        const sql = [
            "SELECT `MaNV`, `TenNV`, `QueQuan`, `GioiTinh`, `NamSinh`, `VaiTro`, `Email`, `Sdt`, `User`, `Pass`",
            "FROM nhanvien",
            "WHERE `User` = ?"
        ].join(" ");
        const [rows] = await db.query(sql, [user]);

        return rows[0];
    }

    async search(keyword) {
        const sql = `
            SELECT ${SAFE_COLUMNS}
            FROM nhanvien
            WHERE MaNV LIKE ?
                OR TenNV LIKE ?
                OR QueQuan LIKE ?
                OR GioiTinh LIKE ?
                OR NamSinh LIKE ?
                OR VaiTro LIKE ?
                OR Email LIKE ?
                OR Sdt LIKE ?
                OR \`User\` LIKE ?
            ORDER BY MaNV
        `;
        const searchValue = `%${keyword}%`;
        const values = Array(9).fill(searchValue);
        const [rows] = await db.query(sql, values);

        return rows;
    }

    async getStatistics() {
        const [summaryRows] = await db.query("SELECT COUNT(MaNV) AS TongNhanVien FROM nhanvien");
        const [roleRows] = await db.query(`
            SELECT VaiTro, COUNT(MaNV) AS SoLuong
            FROM nhanvien
            GROUP BY VaiTro
            ORDER BY VaiTro
        `);
        const [genderRows] = await db.query(`
            SELECT GioiTinh, COUNT(MaNV) AS SoLuong
            FROM nhanvien
            GROUP BY GioiTinh
            ORDER BY GioiTinh
        `);

        return {
            tongQuan: summaryRows[0],
            theoVaiTro: roleRows,
            theoGioiTinh: genderRows
        };
    }

    async create(nhanVien) {
        const sql = [
            "INSERT INTO nhanvien",
            "(`MaNV`, `TenNV`, `QueQuan`, `GioiTinh`, `NamSinh`, `VaiTro`, `Email`, `Sdt`, `User`, `Pass`)",
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ].join(" ");

        const values = [
            nhanVien.getMaNV(),
            nhanVien.getTenNV(),
            nhanVien.getQueQuan(),
            nhanVien.getGioiTinh(),
            nhanVien.getNamSinh(),
            nhanVien.getVaiTro(),
            nhanVien.getEmail(),
            nhanVien.getSdt(),
            nhanVien.getUser(),
            nhanVien.getPass()
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the them nhan vien");
        }

        return nhanVien.toSafeObject();
    }

    async update(maNV, nhanVien) {
        const sql = [
            "UPDATE nhanvien",
            "SET `TenNV` = ?, `QueQuan` = ?, `GioiTinh` = ?, `NamSinh` = ?, `VaiTro` = ?, `Email` = ?, `Sdt` = ?, `User` = ?, `Pass` = ?",
            "WHERE MaNV = ?"
        ].join(" ");

        const values = [
            nhanVien.getTenNV(),
            nhanVien.getQueQuan(),
            nhanVien.getGioiTinh(),
            nhanVien.getNamSinh(),
            nhanVien.getVaiTro(),
            nhanVien.getEmail(),
            nhanVien.getSdt(),
            nhanVien.getUser(),
            nhanVien.getPass(),
            maNV
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Khong the cap nhat nhan vien");
        }

        return {
            MaNV: maNV,
            TenNV: nhanVien.getTenNV(),
            QueQuan: nhanVien.getQueQuan(),
            GioiTinh: nhanVien.getGioiTinh(),
            NamSinh: nhanVien.getNamSinh(),
            VaiTro: nhanVien.getVaiTro(),
            Email: nhanVien.getEmail(),
            Sdt: nhanVien.getSdt(),
            User: nhanVien.getUser()
        };
    }

    async delete(maNV) {
        const sql = "DELETE FROM nhanvien WHERE MaNV = ?";
        const [result] = await db.query(sql, [maNV]);

        return result.affectedRows > 0;
    }
}

module.exports = new NhanVienRepository();
