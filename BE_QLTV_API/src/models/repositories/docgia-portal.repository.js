const db = require("../../config/db");

class DocGiaPortalRepository {
    async getProfile(maDG) {
        const [rows] = await db.query(`
            SELECT dg.MaDG, dg.MaKhoa, k.TenKhoa, dg.MaLop, l.TenLop,
                dg.TenDG, dg.NamSinh, dg.GioiTinh, dg.DiaChi, dg.Email, dg.Sdt
            FROM docgia dg
            LEFT JOIN khoa k ON k.MaKhoa = dg.MaKhoa
            LEFT JOIN lop l ON l.MaLop = dg.MaLop
            WHERE dg.MaDG = ?
        `, [maDG]);
        return rows[0];
    }

    async updateProfile(maDG, profile) {
        await db.query(
            "UPDATE docgia SET DiaChi = ?, Email = ?, Sdt = ? WHERE MaDG = ?",
            [profile.DiaChi, profile.Email, profile.Sdt, maDG]
        );
        return await this.getProfile(maDG);
    }

    async getLibraryCard(maDG) {
        const [rows] = await db.query(`
            SELECT MaThe, MaDG, NgayCap, NgayHetHan,
                CASE WHEN NgayHetHan < CURDATE() THEN 'Hết hạn' ELSE 'Còn hiệu lực' END AS TrangThai
            FROM thethuvien
            WHERE MaDG = ?
            ORDER BY NgayHetHan DESC
            LIMIT 1
        `, [maDG]);
        return rows[0] || null;
    }

    async getCatalog({ keyword, page, pageSize, offset }) {
        const searchValue = `%${keyword}%`;
        const whereClause = keyword
            ? `WHERE s.MaSach LIKE ? OR s.TenSach LIKE ? OR tg.TenTG LIKE ?
                OR nxb.TenNXB LIKE ? OR tl.TenTL LIKE ? OR nn.TenNN LIKE ? OR ks.TenKe LIKE ?`
            : "";
        const searchParams = keyword ? Array(7).fill(searchValue) : [];
        const joins = `
            FROM sach s
            LEFT JOIN tacgia tg ON tg.MaTG = s.MaTG
            LEFT JOIN nhaxuatban nxb ON nxb.MaNXB = s.MaNXB
            LEFT JOIN theloai tl ON tl.MaTL = s.MaTL
            LEFT JOIN ngonngu nn ON nn.MaNN = s.MaNN
            LEFT JOIN kesach ks ON ks.MaViTri = s.MaViTri
        `;
        const [countRows] = await db.query(
            `SELECT COUNT(*) AS totalItems ${joins} ${whereClause}`,
            searchParams
        );
        const [items] = await db.query(`
            SELECT s.MaSach, s.TenSach, s.NamXB, s.SoLuong,
                s.MaTG, tg.TenTG, s.MaNXB, nxb.TenNXB, s.MaTL, tl.TenTL,
                s.MaNN, nn.TenNN, s.MaViTri, ks.TenKe
            ${joins}
            ${whereClause}
            ORDER BY s.TenSach, s.MaSach
            LIMIT ? OFFSET ?
        `, [...searchParams, pageSize, offset]);
        const totalItems = Number(countRows[0]?.totalItems || 0);

        return {
            items,
            pagination: {
                page,
                pageSize,
                totalItems,
                totalPages: Math.ceil(totalItems / pageSize)
            }
        };
    }

    async getLoans(maDG) {
        const [loans] = await db.query(`
            SELECT mt.MaMT, mt.MaDG, mt.MaNV, nv.TenNV, mt.NgayMuon, mt.HanTra,
                mt.NgayTra,
                CASE
                    WHEN mt.NgayTra IS NOT NULL THEN 'Đã trả'
                    WHEN mt.HanTra < CURDATE() THEN 'Quá hạn'
                    ELSE 'Đang mượn'
                END AS TrangThai,
                DATEDIFF(mt.HanTra, CURDATE()) AS SoNgayConLai,
                CASE WHEN mt.NgayTra IS NULL AND mt.HanTra < CURDATE()
                    THEN DATEDIFF(CURDATE(), mt.HanTra) ELSE 0 END AS SoNgayQuaHan,
                CASE WHEN mt.NgayTra IS NULL AND mt.HanTra < CURDATE()
                    THEN DATEDIFF(CURDATE(), mt.HanTra) * COALESCE(qd.PhiQuaHanMoiNgay, 0)
                    ELSE 0 END AS DuKienPhiQuaHan,
                COALESCE((SELECT SUM(vp.SoTien) FROM xulyvipham vp WHERE vp.MaMT = mt.MaMT), 0) AS TienPhat
            FROM muontra mt
            LEFT JOIN nhanvien nv ON nv.MaNV = mt.MaNV
            LEFT JOIN quydinhthuvien qd ON qd.MaQD = 1
            WHERE mt.MaDG = ?
            ORDER BY mt.NgayTra IS NULL DESC, mt.NgayMuon DESC, mt.MaMT DESC
        `, [maDG]);

        if (!loans.length) return loans;

        const [details] = await db.query(`
            SELECT ct.MaMT, ct.MaSach, s.TenSach, ct.SoLuong
            FROM chitietmuontra ct
            INNER JOIN muontra mt ON mt.MaMT = ct.MaMT
            LEFT JOIN sach s ON s.MaSach = ct.MaSach
            WHERE mt.MaDG = ?
            ORDER BY ct.MaMT, s.TenSach
        `, [maDG]);
        const detailsByLoan = new Map();
        details.forEach((detail) => {
            const current = detailsByLoan.get(detail.MaMT) || [];
            current.push(detail);
            detailsByLoan.set(detail.MaMT, current);
        });

        return loans.map((loan) => ({
            ...loan,
            SoNgayConLai: Number(loan.SoNgayConLai),
            SoNgayQuaHan: Number(loan.SoNgayQuaHan),
            DuKienPhiQuaHan: Number(loan.DuKienPhiQuaHan),
            TienPhat: Number(loan.TienPhat),
            ChiTiet: detailsByLoan.get(loan.MaMT) || []
        }));
    }

    async getViolations(maDG) {
        const [rows] = await db.query(`
            SELECT vp.MaVP, vp.MaMT, vp.MaSach, s.TenSach, vp.LoaiViPham,
                vp.SoLuong, vp.SoNgayQuaHan, vp.MucPhiApDung, vp.SoTien,
                vp.MoTa, vp.TrangThaiThu, vp.NgayLap, vp.NgayThu
            FROM xulyvipham vp
            INNER JOIN muontra mt ON mt.MaMT = vp.MaMT
            LEFT JOIN sach s ON s.MaSach = vp.MaSach
            WHERE mt.MaDG = ?
            ORDER BY vp.NgayLap DESC, vp.MaVP DESC
        `, [maDG]);

        return rows.map((row) => ({ ...row, SoTien: Number(row.SoTien) }));
    }
}

module.exports = new DocGiaPortalRepository();

