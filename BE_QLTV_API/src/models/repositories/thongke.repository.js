const db = require("../../config/db");
const { OVERDUE_FINE_PER_DAY } = require("../../config/library");

class ThongKeRepository {
    async getTongQuan() {
        const [summaryRows] = await db.query(`
            SELECT
                (SELECT COUNT(MaSach) FROM sach) AS TongSach,
                (SELECT COALESCE(SUM(SoLuong), 0) FROM sach) AS TongSoLuongSach,
                (SELECT COUNT(MaNV) FROM nhanvien) AS TongNhanVien,
                (SELECT COUNT(MaDG) FROM docgia) AS TongDocGia,
                (SELECT COUNT(MaTL) FROM theloai) AS TongTheLoai,
                (SELECT COUNT(MaTG) FROM tacgia) AS TongTacGia,
                (SELECT COUNT(MaNXB) FROM nhaxuatban) AS TongNhaXuatBan,
                (SELECT COUNT(MaViTri) FROM kesach) AS TongKeSach,
                (SELECT COUNT(MaThe) FROM thethuvien) AS TongTheThuVien,
                (SELECT COUNT(MaMT) FROM muontra) AS TongPhieuMuon,
                (
                    SELECT COALESCE(SUM(
                        GREATEST(DATEDIFF(mt.NgayTra, mt.HanTra), 0)
                        * ${OVERDUE_FINE_PER_DAY}
                    ), 0)
                    FROM muontra mt
                    WHERE mt.NgayTra IS NOT NULL
                ) AS TongTienPhatDaThu
        `);

        const [borrowStatusRows] = await db.query(`
            SELECT
                COALESCE(TrangThai, 'Khong xac dinh') AS TrangThai,
                COUNT(MaMT) AS SoLuong
            FROM muontra
            GROUP BY COALESCE(TrangThai, 'Khong xac dinh')
            ORDER BY TrangThai
        `);

        const [bookStatusRows] = await db.query(`
            SELECT
                SUM(CASE WHEN SoLuong > 0 THEN 1 ELSE 0 END) AS DauSachCon,
                SUM(CASE WHEN SoLuong IS NULL OR SoLuong <= 0 THEN 1 ELSE 0 END) AS DauSachHet,
                SUM(CASE WHEN SoLuong IS NOT NULL AND SoLuong <= 5 THEN 1 ELSE 0 END) AS DauSachSapHet
            FROM sach
        `);

        const [cardStatusRows] = await db.query(`
            SELECT
                TrangThai,
                COUNT(MaThe) AS SoLuong
            FROM thethuvien
            GROUP BY TrangThai
            ORDER BY TrangThai
        `);

        return {
            tongQuan: summaryRows[0],
            tinhTrangSach: bookStatusRows[0],
            phieuMuonTheoTrangThai: borrowStatusRows,
            theThuVienTheoTrangThai: cardStatusRows
        };
    }
}

module.exports = new ThongKeRepository();
