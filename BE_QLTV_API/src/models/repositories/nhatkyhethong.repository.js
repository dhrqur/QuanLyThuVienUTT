const db = require("../../config/db");

const COLUMNS = `
    nk.MaNK, nk.MaNV, nk.TenDangNhap, COALESCE(nv.TenNV, nk.TenDangNhap) AS TenNguoiThucHien,
    nk.VaiTro, nk.HanhDong, nk.DoiTuong, nk.MaDoiTuong,
    nk.MoTa, nk.PhuongThuc, nk.DuongDan, nk.DuLieuYeuCau, nk.DuLieuKetQua,
    nk.DiaChiIP, nk.UserAgent, DATE_FORMAT(nk.ThoiGian, '%Y-%m-%d %H:%i:%s') AS ThoiGian
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
            WHERE nk.MaNV LIKE ? OR nk.TenDangNhap LIKE ? OR nv.TenNV LIKE ?
                OR nk.VaiTro LIKE ? OR nk.HanhDong LIKE ? OR nk.DoiTuong LIKE ?
                OR nk.MaDoiTuong LIKE ? OR nk.MoTa LIKE ? OR nk.DuongDan LIKE ?
                OR CAST(nk.DuLieuYeuCau AS CHAR) LIKE ?
                OR CAST(nk.DuLieuKetQua AS CHAR) LIKE ?
            ORDER BY nk.ThoiGian DESC, nk.MaNK DESC
        `, Array(11).fill(value));
        return rows;
    }

    async create(entry) {
        const [result] = await db.query(`
            INSERT INTO nhatkyhethong
                (MaNV, TenDangNhap, VaiTro, HanhDong, DoiTuong, MaDoiTuong,
                 MoTa, PhuongThuc, DuongDan, DuLieuYeuCau, DuLieuKetQua,
                 DiaChiIP, UserAgent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            entry.MaNV,
            entry.TenDangNhap,
            entry.VaiTro,
            entry.HanhDong,
            entry.DoiTuong,
            entry.MaDoiTuong,
            entry.MoTa,
            entry.PhuongThuc,
            entry.DuongDan,
            entry.DuLieuYeuCau ? JSON.stringify(entry.DuLieuYeuCau) : null,
            entry.DuLieuKetQua ? JSON.stringify(entry.DuLieuKetQua) : null,
            entry.DiaChiIP,
            entry.UserAgent
        ]);
        return result.insertId;
    }
}

module.exports = new NhatKyHeThongRepository();
