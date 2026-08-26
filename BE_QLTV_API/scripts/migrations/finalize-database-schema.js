require("dotenv").config();

const db = require("../../src/config/db");

async function hasColumn(tableName, columnName) {
    const [rows] = await db.query(`
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = ?
          AND column_name = ?
        LIMIT 1
    `, [tableName, columnName]);
    return rows.length > 0;
}

async function hasConstraint(tableName, constraintName) {
    const [rows] = await db.query(`
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_schema = DATABASE()
          AND table_name = ?
          AND constraint_name = ?
        LIMIT 1
    `, [tableName, constraintName]);
    return rows.length > 0;
}

async function hasIndex(tableName, indexName) {
    const [rows] = await db.query(`
        SELECT 1
        FROM information_schema.statistics
        WHERE table_schema = DATABASE()
          AND table_name = ?
          AND index_name = ?
        LIMIT 1
    `, [tableName, indexName]);
    return rows.length > 0;
}

async function addConstraint(tableName, constraintName, definition) {
    if (await hasConstraint(tableName, constraintName)) return;
    await db.query(`ALTER TABLE \`${tableName}\` ADD CONSTRAINT \`${constraintName}\` ${definition}`);
}

async function addIndex(tableName, indexName, columns) {
    if (await hasIndex(tableName, indexName)) return;
    await db.query(`ALTER TABLE \`${tableName}\` ADD INDEX \`${indexName}\` (${columns})`);
}

async function addUniqueIndex(tableName, indexName, columns) {
    if (await hasIndex(tableName, indexName)) return;
    await db.query(`ALTER TABLE \`${tableName}\` ADD UNIQUE INDEX \`${indexName}\` (${columns})`);
}

async function assertNoRows(message, sql) {
    const [rows] = await db.query(sql);
    if (rows.length) {
        throw new Error(`${message}: ${JSON.stringify(rows.slice(0, 10))}`);
    }
}

async function normalizeData() {
    await db.query(`
        UPDATE muontra
        SET TrangThai = CASE
            WHEN NgayTra IS NOT NULL THEN 'Đã trả'
            WHEN HanTra < CURDATE() THEN 'Quá hạn'
            ELSE 'Đang mượn'
        END
    `);

    await db.query(`
        UPDATE thethuvien
        SET TrangThai = CASE
            WHEN NgayHetHan < CURDATE() THEN 'Hết hạn'
            ELSE 'Còn hiệu lực'
        END
    `);

    await db.query(`
        UPDATE xulyvipham vp
        INNER JOIN muontra mt ON mt.MaMT = vp.MaMT
        SET vp.MaNVThu = mt.MaNV
        WHERE vp.TrangThaiThu = 'DA_THU'
          AND vp.MaNVThu IS NULL
    `);

    await db.query(`
        UPDATE xulyvipham
        SET NgayThu = NULL, MaNVThu = NULL
        WHERE TrangThaiThu IN ('CHUA_THU', 'MIEN_PHAT')
    `);
}

async function addViolationSnapshotColumns() {
    if (!await hasColumn("xulyvipham", "SoNgayQuaHan")) {
        await db.query(`
            ALTER TABLE xulyvipham
            ADD COLUMN SoNgayQuaHan int DEFAULT NULL AFTER SoLuong
        `);
    }

    if (!await hasColumn("xulyvipham", "MucPhiApDung")) {
        await db.query(`
            ALTER TABLE xulyvipham
            ADD COLUMN MucPhiApDung decimal(15,2) NOT NULL DEFAULT 0 AFTER SoNgayQuaHan
        `);
    }

    await db.query(`
        UPDATE xulyvipham vp
        INNER JOIN muontra mt ON mt.MaMT = vp.MaMT
        SET vp.SoNgayQuaHan = CASE
                WHEN vp.LoaiViPham = 'QUA_HAN'
                THEN GREATEST(DATEDIFF(mt.NgayTra, mt.HanTra), 1)
                ELSE NULL
            END,
            vp.MucPhiApDung = CASE
                WHEN vp.LoaiViPham = 'QUA_HAN'
                    THEN vp.SoTien / GREATEST(DATEDIFF(mt.NgayTra, mt.HanTra), 1)
                WHEN vp.SoLuong > 0
                    THEN vp.SoTien / vp.SoLuong
                ELSE 0
            END
    `);
}

async function finalizeBaseTables() {
    await assertNoRows(
        "Không thể bắt buộc khoa/lớp vì có độc giả thiếu hoặc chọn lớp sai khoa",
        `SELECT dg.MaDG, dg.MaKhoa, dg.MaLop, l.MaKhoa AS MaKhoaCuaLop
         FROM docgia dg
         LEFT JOIN lop l ON l.MaLop = dg.MaLop
         WHERE dg.MaKhoa IS NULL OR dg.MaLop IS NULL
            OR l.MaLop IS NULL OR dg.MaKhoa <> l.MaKhoa`
    );
    await assertNoRows(
        "Không thể thêm ràng buộc ngày cho phiếu mượn",
        `SELECT MaMT FROM muontra
         WHERE NgayMuon IS NULL OR HanTra <= NgayMuon
            OR (NgayTra IS NOT NULL AND NgayTra < NgayMuon)`
    );
    await assertNoRows(
        "Không thể thêm ràng buộc ngày cho thẻ thư viện",
        "SELECT MaThe FROM thethuvien WHERE NgayHetHan <= NgayCap"
    );
    await assertNoRows(
        "Không thể thêm ràng buộc số lượng",
        `SELECT MaSach AS Ma FROM sach WHERE SoLuong IS NULL OR SoLuong < 0
         UNION ALL
         SELECT CONCAT(MaMT, '/', MaSach) AS Ma FROM chitietmuontra WHERE SoLuong <= 0`
    );

    await db.query(`
        ALTER TABLE docgia
        MODIFY MaKhoa varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
        MODIFY MaLop varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL
    `);
    await addUniqueIndex("lop", "uq_lop_malop_makhoa", "MaLop, MaKhoa");
    await addConstraint(
        "docgia",
        "fk_docgia_lop_khoa",
        "FOREIGN KEY (MaLop, MaKhoa) REFERENCES lop (MaLop, MaKhoa)"
    );

    await db.query(`
        ALTER TABLE kesach
        MODIFY MoTa varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL
    `);
    await db.query("ALTER TABLE sach MODIFY SoLuong int NOT NULL DEFAULT 0");
    await db.query("ALTER TABLE muontra MODIFY NgayMuon date NOT NULL");
    await db.query(`
        ALTER TABLE muontra
        MODIFY TrangThai enum('Đang mượn','Quá hạn','Đã trả')
            COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'Đang mượn'
    `);
    await db.query(`
        ALTER TABLE thethuvien
        MODIFY NgayCap date NOT NULL DEFAULT (CURRENT_DATE),
        MODIFY TrangThai enum('Còn hiệu lực','Hết hạn')
            COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'Còn hiệu lực'
    `);

    await addConstraint("sach", "chk_sach_soluong", "CHECK (SoLuong >= 0)");
    await addConstraint("chitietmuontra", "chk_chitietmuontra_soluong", "CHECK (SoLuong > 0)");
    await addConstraint("muontra", "chk_muontra_hantra", "CHECK (HanTra > NgayMuon)");
    await addConstraint(
        "muontra",
        "chk_muontra_ngaytra",
        "CHECK (NgayTra IS NULL OR NgayTra >= NgayMuon)"
    );
    await addConstraint(
        "muontra",
        "chk_muontra_trangthai",
        `CHECK (
            (NgayTra IS NOT NULL AND TrangThai = 'Đã trả')
            OR
            (NgayTra IS NULL AND TrangThai IN ('Đang mượn','Quá hạn'))
        )`
    );
    await addConstraint("thethuvien", "chk_thethuvien_ngay", "CHECK (NgayHetHan > NgayCap)");

    await addIndex("muontra", "idx_muontra_docgia_ngaytra", "MaDG, NgayTra");
    await addIndex("muontra", "idx_muontra_ngaymuon", "NgayMuon");
    await addIndex("muontra", "idx_muontra_ngaytra", "NgayTra");
    await addIndex("muontra", "idx_muontra_trangthai", "TrangThai");
    await addIndex("thethuvien", "idx_thethuvien_docgia_hethan", "MaDG, NgayHetHan");
    await addIndex("thethuvien", "idx_thethuvien_trangthai", "TrangThai");
}

async function finalizeViolations() {
    await assertNoRows(
        "Không thể tạo khóa chính chi tiết mượn vì có sách bị lặp trong cùng phiếu",
        `SELECT MaMT, MaSach, COUNT(*) AS SoDong
         FROM chitietmuontra
         GROUP BY MaMT, MaSach
         HAVING COUNT(*) > 1`
    );
    if (!await hasConstraint("chitietmuontra", "PRIMARY")) {
        await db.query("ALTER TABLE chitietmuontra ADD PRIMARY KEY (MaMT, MaSach)");
    }

    await assertNoRows(
        "Có vi phạm sách không thuộc chi tiết phiếu mượn",
        `SELECT vp.MaVP, vp.MaMT, vp.MaSach
         FROM xulyvipham vp
         LEFT JOIN chitietmuontra ct
           ON ct.MaMT = vp.MaMT AND ct.MaSach = vp.MaSach
         WHERE vp.MaSach IS NOT NULL AND ct.MaMT IS NULL`
    );
    await assertNoRows(
        "Có vi phạm không phù hợp với loại vi phạm",
        `SELECT MaVP FROM xulyvipham
         WHERE SoLuong < 0 OR MucPhiApDung < 0 OR SoTien < 0
            OR (LoaiViPham = 'QUA_HAN' AND (MaSach IS NOT NULL OR SoNgayQuaHan IS NULL))
            OR (LoaiViPham IN ('HU_HONG','LAM_MAT') AND (MaSach IS NULL OR SoNgayQuaHan IS NOT NULL))
            OR (TrangThaiThu = 'DA_THU' AND (NgayThu IS NULL OR MaNVThu IS NULL))
            OR (TrangThaiThu IN ('CHUA_THU','MIEN_PHAT') AND (NgayThu IS NOT NULL OR MaNVThu IS NOT NULL))`
    );

    if (await hasConstraint("xulyvipham", "fk_xulyvipham_sach")) {
        await db.query("ALTER TABLE xulyvipham DROP FOREIGN KEY fk_xulyvipham_sach");
    }
    await addIndex("xulyvipham", "idx_xulyvipham_mamt_masach", "MaMT, MaSach");
    await addIndex("xulyvipham", "idx_xulyvipham_trangthai_ngaylap", "TrangThaiThu, NgayLap");
    await addConstraint(
        "xulyvipham",
        "fk_xulyvipham_chitietmuon",
        "FOREIGN KEY (MaMT, MaSach) REFERENCES chitietmuontra (MaMT, MaSach)"
    );
    await addConstraint("xulyvipham", "chk_xulyvipham_soluong", "CHECK (SoLuong >= 0)");
    await addConstraint(
        "xulyvipham",
        "chk_xulyvipham_songay",
        "CHECK (SoNgayQuaHan IS NULL OR SoNgayQuaHan > 0)"
    );
    await addConstraint("xulyvipham", "chk_xulyvipham_mucphi", "CHECK (MucPhiApDung >= 0)");
    await addConstraint("xulyvipham", "chk_xulyvipham_sotien", "CHECK (SoTien >= 0)");
    await addConstraint(
        "xulyvipham",
        "chk_xulyvipham_ngaythu",
        "CHECK (NgayThu IS NULL OR NgayThu >= NgayLap)"
    );
    await addConstraint(
        "xulyvipham",
        "chk_xulyvipham_sach",
        `CHECK (
            (LoaiViPham = 'QUA_HAN' AND MaSach IS NULL AND SoNgayQuaHan IS NOT NULL)
            OR
            (LoaiViPham IN ('HU_HONG','LAM_MAT') AND MaSach IS NOT NULL AND SoNgayQuaHan IS NULL)
        )`
    );
    await addConstraint(
        "xulyvipham",
        "chk_xulyvipham_thutien",
        `CHECK (
            (TrangThaiThu = 'DA_THU' AND NgayThu IS NOT NULL AND MaNVThu IS NOT NULL)
            OR
            (TrangThaiThu IN ('CHUA_THU','MIEN_PHAT') AND NgayThu IS NULL AND MaNVThu IS NULL)
        )`
    );
}

async function finalizeSupportingTables() {
    await addConstraint(
        "nhatkyhethong",
        "fk_nhatky_nhanvien",
        "FOREIGN KEY (MaNV) REFERENCES nhanvien (MaNV) ON UPDATE CASCADE ON DELETE SET NULL"
    );
    await addConstraint(
        "quydinhthuvien",
        "chk_quydinh_phi",
        "CHECK (PhiQuaHanMoiNgay >= 0 AND PhiHuHongMoiBan >= 0 AND PhiLamMatMoiBan >= 0)"
    );
}

async function main() {
    await db.testConnection();
    await normalizeData();
    await addViolationSnapshotColumns();
    await finalizeBaseTables();
    await finalizeViolations();
    await finalizeSupportingTables();
    console.log("Da chot va dong bo schema co so du lieu thanh cong.");
}

main()
    .catch((error) => {
        console.error("Khong the chot schema:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await db.end();
    });
