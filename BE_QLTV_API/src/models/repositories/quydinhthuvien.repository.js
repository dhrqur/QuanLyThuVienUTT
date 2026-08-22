const db = require("../../config/db");
class QuyDinhThuVienRepository {
    async get() {
        const [rows] = await db.query(`SELECT qd.*, nv.TenNV AS TenNVCapNhat
            FROM quydinhthuvien qd LEFT JOIN nhanvien nv ON nv.MaNV = qd.MaNVCapNhat
            WHERE qd.MaQD = 1`);
        return rows[0];
    }
    async update(data, employeeId) {
        await db.query(`UPDATE quydinhthuvien SET PhiQuaHanMoiNgay = ?, PhiHuHongMoiBan = ?,
            PhiLamMatMoiBan = ?, NgayCapNhat = NOW(), MaNVCapNhat = ? WHERE MaQD = 1`, [
            data.PhiQuaHanMoiNgay, data.PhiHuHongMoiBan, data.PhiLamMatMoiBan, employeeId
        ]);
        return await this.get();
    }
}
module.exports = new QuyDinhThuVienRepository();
