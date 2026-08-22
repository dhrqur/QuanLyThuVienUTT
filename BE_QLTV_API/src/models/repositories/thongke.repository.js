const db = require("../../config/db");

class ThongKeRepository {
    async getDashboard({ days, year, month }) {
        const periodDays = [7, 30, 90].includes(Number(days)) ? Number(days) : 30;
        const selectedYear = Number(year);
        const selectedMonth = Number(month);
        const now = new Date();
        const safeYear = Number.isInteger(selectedYear) && selectedYear >= 2000 && selectedYear <= 2100
            ? selectedYear
            : now.getFullYear();
        const safeMonth = Number.isInteger(selectedMonth) && selectedMonth >= 1 && selectedMonth <= 12
            ? selectedMonth
            : now.getMonth() + 1;

        const [snapshotRows] = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM sach) AS TongDauSach,
                (SELECT COALESCE(SUM(SoLuong), 0) FROM sach) AS SoBanTrongKho,
                (SELECT COALESCE(SUM(ct.SoLuong), 0)
                    FROM chitietmuontra ct
                    INNER JOIN muontra mt ON mt.MaMT = ct.MaMT
                    WHERE mt.NgayTra IS NULL) AS SoBanDangMuon,
                (SELECT COUNT(*) FROM muontra WHERE NgayTra IS NULL) AS PhieuChuaHoanTat,
                (SELECT COUNT(*) FROM muontra WHERE NgayTra IS NULL AND HanTra < CURDATE()) AS PhieuQuaHan,
                (SELECT COALESCE(SUM(ct.SoLuong), 0)
                    FROM chitietmuontra ct
                    INNER JOIN muontra mt ON mt.MaMT = ct.MaMT
                    WHERE mt.NgayTra IS NULL AND mt.HanTra < CURDATE()) AS SoBanQuaHan,
                (SELECT COUNT(*) FROM sach WHERE SoLuong IS NULL OR SoLuong <= 5) AS DauSachCanBoSung,
                (SELECT COALESCE(SUM(SoTien), 0) FROM xulyvipham WHERE TrangThaiThu = 'DA_THU') AS TongTienPhatDaThu,
                (SELECT COUNT(*) FROM xulyvipham WHERE TrangThaiThu = 'CHUA_THU') AS SoViPhamChuaThu,
                (SELECT COALESCE(SUM(SoTien), 0) FROM xulyvipham WHERE TrangThaiThu = 'CHUA_THU') AS TienPhatChuaThu
        `);

        const [trendRows] = await db.query(`
            SELECT
                COALESCE(SUM(CASE
                    WHEN mt.NgayMuon BETWEEN DATE_SUB(CURDATE(), INTERVAL ? DAY) AND CURDATE()
                    THEN ct.SoLuong ELSE 0 END), 0) AS MuonKyNay,
                COALESCE(SUM(CASE
                    WHEN mt.NgayMuon BETWEEN DATE_SUB(CURDATE(), INTERVAL ? DAY)
                        AND DATE_SUB(CURDATE(), INTERVAL ? DAY)
                    THEN ct.SoLuong ELSE 0 END), 0) AS MuonKyTruoc,
                COUNT(DISTINCT CASE
                    WHEN mt.HanTra BETWEEN DATE_SUB(CURDATE(), INTERVAL ? DAY) AND CURDATE()
                        AND mt.NgayTra IS NULL AND mt.HanTra < CURDATE()
                    THEN mt.MaMT END) AS QuaHanKyNay,
                COUNT(DISTINCT CASE
                    WHEN mt.HanTra BETWEEN DATE_SUB(CURDATE(), INTERVAL ? DAY)
                        AND DATE_SUB(CURDATE(), INTERVAL ? DAY)
                        AND mt.NgayTra IS NULL
                    THEN mt.MaMT END) AS QuaHanKyTruoc,
                (SELECT COALESCE(SUM(SoTien), 0) FROM xulyvipham
                    WHERE TrangThaiThu = 'DA_THU' AND NgayThu BETWEEN DATE_SUB(CURDATE(), INTERVAL ? DAY) AND CURDATE()) AS TienPhatKyNay,
                (SELECT COALESCE(SUM(SoTien), 0) FROM xulyvipham
                    WHERE TrangThaiThu = 'DA_THU' AND NgayThu BETWEEN DATE_SUB(CURDATE(), INTERVAL ? DAY)
                        AND DATE_SUB(CURDATE(), INTERVAL ? DAY)) AS TienPhatKyTruoc
            FROM muontra mt
            LEFT JOIN chitietmuontra ct ON ct.MaMT = mt.MaMT
        `, [
            periodDays - 1,
            periodDays * 2 - 1, periodDays,
            periodDays - 1,
            periodDays * 2 - 1, periodDays,
            periodDays - 1,
            periodDays * 2 - 1, periodDays
        ]);

        const [stockRows] = await db.query(`
            SELECT
                SUM(CASE WHEN SoLuong > 5 THEN 1 ELSE 0 END) AS OnDinh,
                SUM(CASE WHEN SoLuong BETWEEN 1 AND 5 THEN 1 ELSE 0 END) AS SapHet,
                SUM(CASE WHEN SoLuong IS NULL OR SoLuong <= 0 THEN 1 ELSE 0 END) AS HetSach
            FROM sach
        `);

        const [attentionRows] = await db.query(`
            SELECT MaSach, TenSach, COALESCE(SoLuong, 0) AS SoLuong,
                CASE WHEN SoLuong IS NULL OR SoLuong <= 0 THEN 'Hết sách' ELSE 'Sắp hết' END AS TrangThai
            FROM sach
            WHERE SoLuong IS NULL OR SoLuong <= 5
            ORDER BY (SoLuong IS NULL OR SoLuong <= 0) DESC, SoLuong, TenSach
            LIMIT 8
        `);

        const [popularRows] = await db.query(`
            SELECT s.MaSach, s.TenSach, COALESCE(SUM(ct.SoLuong), 0) AS TongLuotMuon
            FROM sach s
            INNER JOIN chitietmuontra ct ON ct.MaSach = s.MaSach
            GROUP BY s.MaSach, s.TenSach
            ORDER BY TongLuotMuon DESC, s.TenSach
            LIMIT 5
        `);

        const [overdueRows] = await db.query(`
            SELECT mt.MaMT, mt.MaDG, dg.TenDG, dg.Sdt, dg.Email,
                mt.NgayMuon, mt.HanTra, DATEDIFF(CURDATE(), mt.HanTra) AS SoNgayQuaHan,
                COALESCE(SUM(ct.SoLuong), 0) AS TongSoLuong
            FROM muontra mt
            LEFT JOIN docgia dg ON dg.MaDG = mt.MaDG
            LEFT JOIN chitietmuontra ct ON ct.MaMT = mt.MaMT
            WHERE mt.NgayTra IS NULL AND mt.HanTra < CURDATE()
            GROUP BY mt.MaMT, mt.MaDG, dg.TenDG, dg.Sdt, dg.Email, mt.NgayMuon, mt.HanTra
            ORDER BY SoNgayQuaHan DESC, mt.HanTra
            LIMIT 10
        `);

        const [activityRows] = await db.query(`
            SELECT Ngay, SUM(SoLuotMuon) AS SoLuotMuon, SUM(SoLuotTra) AS SoLuotTra
            FROM (
                SELECT DATE(NgayMuon) AS Ngay, COUNT(*) AS SoLuotMuon, 0 AS SoLuotTra
                FROM muontra
                WHERE YEAR(NgayMuon) = ? AND MONTH(NgayMuon) = ?
                    AND NgayMuon <= LEAST(LAST_DAY(CONCAT(?, '-', LPAD(?, 2, '0'), '-01')), CURDATE())
                GROUP BY DATE(NgayMuon)
                UNION ALL
                SELECT DATE(NgayTra) AS Ngay, 0 AS SoLuotMuon, COUNT(*) AS SoLuotTra
                FROM muontra
                WHERE NgayTra IS NOT NULL AND YEAR(NgayTra) = ? AND MONTH(NgayTra) = ?
                    AND NgayTra <= LEAST(LAST_DAY(CONCAT(?, '-', LPAD(?, 2, '0'), '-01')), CURDATE())
                GROUP BY DATE(NgayTra)
            ) activity
            GROUP BY Ngay
            ORDER BY Ngay
        `, [safeYear, safeMonth, safeYear, safeMonth, safeYear, safeMonth, safeYear, safeMonth]);

        const [periodActivityRows] = await db.query(`
            SELECT Ngay, SUM(SoLuotMuon) AS SoLuotMuon, SUM(SoLuotTra) AS SoLuotTra
            FROM (
                SELECT DATE(NgayMuon) AS Ngay, COUNT(*) AS SoLuotMuon, 0 AS SoLuotTra
                FROM muontra
                WHERE NgayMuon BETWEEN DATE_SUB(CURDATE(), INTERVAL ? DAY) AND CURDATE()
                GROUP BY DATE(NgayMuon)
                UNION ALL
                SELECT DATE(NgayTra) AS Ngay, 0 AS SoLuotMuon, COUNT(*) AS SoLuotTra
                FROM muontra
                WHERE NgayTra BETWEEN DATE_SUB(CURDATE(), INTERVAL ? DAY) AND CURDATE()
                GROUP BY DATE(NgayTra)
            ) activity
            GROUP BY Ngay
            ORDER BY Ngay
        `, [periodDays - 1, periodDays - 1]);

        const [monthRows] = await db.query(`
            SELECT Nam, Thang FROM (
                SELECT YEAR(NgayMuon) AS Nam, MONTH(NgayMuon) AS Thang FROM muontra WHERE NgayMuon IS NOT NULL
                UNION
                SELECT YEAR(NgayTra) AS Nam, MONTH(NgayTra) AS Thang FROM muontra WHERE NgayTra IS NOT NULL
            ) months
            ORDER BY Nam DESC, Thang DESC
            LIMIT 12
        `);

        const snapshot = snapshotRows[0];
        snapshot.TongSoBan = Number(snapshot.SoBanTrongKho) + Number(snapshot.SoBanDangMuon);

        return {
            tongQuan: snapshot,
            xuHuong: trendRows[0],
            tinhTrangKho: stockRows[0],
            sachCanBoSung: attentionRows,
            sachMuonNhieu: popularRows,
            phieuQuaHan: overdueRows,
            hoatDongTheoNgay: activityRows,
            hoatDongTheoKy: periodActivityRows,
            thangCoDuLieu: monthRows,
            kyThongKe: { days: periodDays, year: safeYear, month: safeMonth }
        };
    }

}

module.exports = new ThongKeRepository();
