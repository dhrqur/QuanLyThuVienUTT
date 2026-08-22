const db = require("../../config/db");

const COLUMNS = `vp.MaVP, vp.MaMT, mt.MaDG, dg.TenDG, vp.MaSach, s.TenSach,
    vp.LoaiViPham,
    CASE
        WHEN vp.LoaiViPham = 'QUA_HAN' AND vp.SoLuong = 0
        THEN (SELECT COALESCE(SUM(ct.SoLuong), 0) FROM chitietmuontra ct WHERE ct.MaMT = vp.MaMT)
        ELSE vp.SoLuong
    END AS SoLuong,
    vp.SoTien, vp.MoTa, vp.TrangThaiThu,
    vp.NgayLap, vp.NgayThu, vp.MaNVThu,
    COALESCE(nv.TenNV, CASE WHEN vp.TrangThaiThu = 'DA_THU' THEN nvPhieu.TenNV END) AS TenNVThu`;

const JOINS = `INNER JOIN muontra mt ON mt.MaMT = vp.MaMT
    LEFT JOIN docgia dg ON dg.MaDG = mt.MaDG
    LEFT JOIN sach s ON s.MaSach = vp.MaSach
    LEFT JOIN nhanvien nv ON nv.MaNV = vp.MaNVThu
    LEFT JOIN nhanvien nvPhieu ON nvPhieu.MaNV = mt.MaNV`;

class XuLyViPhamRepository {
    async getAll() {
        const [rows] = await db.query(`SELECT ${COLUMNS} FROM xulyvipham vp ${JOINS}
            ORDER BY vp.TrangThaiThu = 'CHUA_THU' DESC, vp.NgayLap DESC, vp.MaVP DESC`);
        return rows;
    }

    async getById(maVP) {
        const [rows] = await db.query(`SELECT ${COLUMNS} FROM xulyvipham vp ${JOINS}
            WHERE vp.MaVP = ?`, [maVP]);
        return rows[0];
    }

    async search(keyword) {
        const value = `%${keyword}%`;
        const [rows] = await db.query(`SELECT ${COLUMNS} FROM xulyvipham vp ${JOINS}
            WHERE vp.MaMT LIKE ? OR dg.TenDG LIKE ? OR s.TenSach LIKE ?
                OR vp.LoaiViPham LIKE ? OR vp.TrangThaiThu LIKE ?
            ORDER BY vp.NgayLap DESC, vp.MaVP DESC`, [value, value, value, value, value]);
        return rows;
    }

    async update(maVP, data, employeeId) {
        const collected = data.TrangThaiThu === "DA_THU";
        await db.query(`UPDATE xulyvipham SET MoTa = ?, TrangThaiThu = ?,
            NgayThu = ?, MaNVThu = ? WHERE MaVP = ?`, [
            data.MoTa || null, data.TrangThaiThu,
            collected ? new Date() : null, collected ? employeeId : null, maVP
        ]);
        return await this.getById(maVP);
    }
}

module.exports = new XuLyViPhamRepository();
