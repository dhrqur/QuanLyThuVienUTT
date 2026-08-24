const db = require("../../config/db");

const COLUMNS = `
    nk.MaNK, nk.MaNV, nv.TenNV AS TenNguoiThucHien,
    nk.HanhDong, nk.DoiTuong, nk.MaDoiTuong, nk.MoTa, nk.UserAgent,
    DATE_FORMAT(nk.ThoiGian, '%Y-%m-%d %H:%i:%s') AS ThoiGian
`;

class NhatKyHeThongRepository {
    async getAll() {
        const [rows] = await db.query(`
            SELECT ${COLUMNS}
            FROM nhatkyhethong nk
            LEFT JOIN nhanvien nv ON nv.MaNV = nk.MaNV
            ORDER BY nk.ThoiGian DESC, nk.MaNK DESC
        `);
        return rows;
    }

    async search(keyword) {
        const value = `%${keyword}%`;
        const [rows] = await db.query(`
            SELECT ${COLUMNS}
            FROM nhatkyhethong nk
            LEFT JOIN nhanvien nv ON nv.MaNV = nk.MaNV
            WHERE nk.MaNV LIKE ? OR nv.TenNV LIKE ? OR nk.HanhDong LIKE ?
                OR nk.DoiTuong LIKE ? OR nk.MaDoiTuong LIKE ? OR nk.MoTa LIKE ?
            ORDER BY nk.ThoiGian DESC, nk.MaNK DESC
        `, Array(6).fill(value));
        return rows;
    }

    async create(entry) {
        const [result] = await db.query(`
            INSERT INTO nhatkyhethong
                (MaNV, HanhDong, DoiTuong, MaDoiTuong, MoTa, UserAgent)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            entry.MaNV,
            entry.HanhDong,
            entry.DoiTuong,
            entry.MaDoiTuong,
            entry.MoTa,
            entry.UserAgent
        ]);
        return result.insertId;
    }
}

module.exports = new NhatKyHeThongRepository();
