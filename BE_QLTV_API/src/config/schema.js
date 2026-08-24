const db = require("./db");

async function ensureRuntimeSchema() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS nhatkyhethong (
            MaNK bigint unsigned NOT NULL AUTO_INCREMENT,
            MaNV varchar(10) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            TenDangNhap varchar(100) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            VaiTro varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            HanhDong varchar(30) COLLATE utf8mb4_unicode_520_ci NOT NULL,
            DoiTuong varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
            MaDoiTuong varchar(100) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            MoTa varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
            PhuongThuc varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
            DuongDan varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
            DuLieuYeuCau json DEFAULT NULL,
            DuLieuKetQua json DEFAULT NULL,
            DiaChiIP varchar(64) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            UserAgent varchar(500) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            ThoiGian datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (MaNK),
            KEY idx_nhatky_manv (MaNV),
            KEY idx_nhatky_hanhdong (HanhDong),
            KEY idx_nhatky_doituong (DoiTuong, MaDoiTuong),
            KEY idx_nhatky_thoigian (ThoiGian)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci
    `);
}

module.exports = { ensureRuntimeSchema };
