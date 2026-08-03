-- Chay mot lan tren database hien tai truoc khi deploy backend moi.
-- Sao luu database truoc khi chay vi cac lenh DDL cua MySQL tu dong commit.

ALTER TABLE `nhanvien`
  MODIFY COLUMN `Pass` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  ADD UNIQUE KEY `uq_nhanvien_user` (`User`);

-- Doi mat khau cua bon tai khoan mau thanh 123456, da bam bcrypt (cost 12).
UPDATE `nhanvien`
SET `Pass` = '$2b$12$c8X6s8oK/Sf3gZivONAY3u3izOCykdfr2sVaQobK2YwYQIuY9wx2i'
WHERE `User` IN ('nv1', 'nv2', 'nv3', 'nv4');

ALTER TABLE `chitietmuontra`
  ADD PRIMARY KEY (`MaMT`, `MaSach`);

ALTER TABLE `docgia`
  DROP FOREIGN KEY `docgia_ibfk_1`,
  DROP FOREIGN KEY `docgia_ibfk_2`,
  DROP COLUMN `MaKhoa`,
  DROP COLUMN `MaLop`;

DROP TABLE `lop`;
DROP TABLE `khoa`;
