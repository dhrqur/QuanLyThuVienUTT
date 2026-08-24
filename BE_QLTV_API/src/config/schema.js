const db = require("./db");

async function ensureRuntimeSchema() {
    await ensureLibraryRulesTable();
    await ensureViolationsTable();
    await ensureAuditLogTable();
}

async function ensureLibraryRulesTable() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS quydinhthuvien (
            MaQD tinyint unsigned NOT NULL,
            PhiQuaHanMoiNgay decimal(15,2) NOT NULL DEFAULT 2000,
            PhiHuHongMoiBan decimal(15,2) NOT NULL DEFAULT 50000,
            PhiLamMatMoiBan decimal(15,2) NOT NULL DEFAULT 200000,
            NgayCapNhat datetime DEFAULT NULL,
            MaNVCapNhat varchar(10) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            PRIMARY KEY (MaQD),
            CONSTRAINT fk_quydinh_nhanvien
                FOREIGN KEY (MaNVCapNhat) REFERENCES nhanvien (MaNV)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci
    `);

    await db.query(`
        INSERT INTO quydinhthuvien
            (MaQD, PhiQuaHanMoiNgay, PhiHuHongMoiBan, PhiLamMatMoiBan)
        VALUES (1, 2000, 50000, 200000)
        ON DUPLICATE KEY UPDATE MaQD = 1
    `);
}

async function ensureViolationsTable() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS xulyvipham (
            MaVP bigint unsigned NOT NULL AUTO_INCREMENT,
            MaMT varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
            MaSach varchar(10) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            LoaiViPham enum('QUA_HAN','HU_HONG','LAM_MAT')
                COLLATE utf8mb4_unicode_520_ci NOT NULL,
            SoLuong int NOT NULL DEFAULT 0,
            SoTien decimal(15,2) NOT NULL DEFAULT 0,
            MoTa varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            TrangThaiThu enum('CHUA_THU','DA_THU','MIEN_PHAT')
                COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'CHUA_THU',
            NgayLap date NOT NULL,
            NgayThu date DEFAULT NULL,
            MaNVThu varchar(10) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            PRIMARY KEY (MaVP),
            KEY idx_xulyvipham_mamt (MaMT),
            KEY idx_xulyvipham_trangthai (TrangThaiThu),
            CONSTRAINT fk_xulyvipham_muontra FOREIGN KEY (MaMT) REFERENCES muontra (MaMT),
            CONSTRAINT fk_xulyvipham_sach FOREIGN KEY (MaSach) REFERENCES sach (MaSach),
            CONSTRAINT fk_xulyvipham_nhanvien FOREIGN KEY (MaNVThu) REFERENCES nhanvien (MaNV)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci
    `);
}

async function ensureAuditLogTable() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS nhatkyhethong (
            MaNK bigint unsigned NOT NULL AUTO_INCREMENT,
            MaNV varchar(10) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            HanhDong varchar(30) COLLATE utf8mb4_unicode_520_ci NOT NULL,
            DoiTuong varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
            MaDoiTuong varchar(100) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            MoTa varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
            UserAgent varchar(500) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            ThoiGian datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (MaNK),
            KEY idx_nhatky_manv (MaNV),
            KEY idx_nhatky_hanhdong (HanhDong),
            KEY idx_nhatky_doituong (DoiTuong, MaDoiTuong),
            KEY idx_nhatky_thoigian (ThoiGian)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci
    `);

    await removeLegacyAuditColumns();
}

async function removeLegacyAuditColumns() {
    const legacyColumns = [
        "TenDangNhap",
        "VaiTro",
        "PhuongThuc",
        "DuongDan",
        "DuLieuYeuCau",
        "DuLieuKetQua",
        "DiaChiIP"
    ];
    const [existingColumns] = await db.query(`
        SELECT COLUMN_NAME
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = 'nhatkyhethong'
          AND COLUMN_NAME IN (?)
    `, [legacyColumns]);

    if (!existingColumns.length) return;

    const columnsToDrop = existingColumns
        .map(row => legacyColumns.find(column => column === row.COLUMN_NAME))
        .filter(Boolean)
        .map(column => `DROP COLUMN \`${column}\``)
        .join(", ");

    await db.query(`ALTER TABLE nhatkyhethong ${columnsToDrop}`);
}

module.exports = { ensureRuntimeSchema };
