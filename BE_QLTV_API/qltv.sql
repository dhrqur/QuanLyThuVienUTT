-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               9.5.0 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.13.0.7147
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for dbqltv
CREATE DATABASE IF NOT EXISTS `qltv` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `qltv`;

-- Dumping structure for table dbqltv.chitietmuontra
CREATE TABLE IF NOT EXISTS `chitietmuontra` (
  `MaMT` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `MaSach` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `SoLuong` int NOT NULL,
  KEY `MaMT` (`MaMT`),
  KEY `MaSach` (`MaSach`),
  CONSTRAINT `chitietmuontra_ibfk_1` FOREIGN KEY (`MaMT`) REFERENCES `muontra` (`MaMT`),
  CONSTRAINT `chitietmuontra_ibfk_2` FOREIGN KEY (`MaSach`) REFERENCES `sach` (`MaSach`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.chitietmuontra: ~3 rows (approximately)
INSERT INTO `chitietmuontra` (`MaMT`, `MaSach`, `SoLuong`) VALUES
	('MT001', 'S001', 1),
	('MT002', 'S015', 1),
	('MT003', 'S001', 3),
	('MT003', 'S005', 3),
	('MT004', 'S020', 1),
	('MT004', 'S025', 1),
	('MT005', 'S017', 2),
	('MT006', 'S011', 1),
	('MT006', 'S028', 1),
	('MT007', 'S022', 1),
	('MT008', 'S030', 2),
	('MT009', 'S016', 1),
	('MT009', 'S031', 1),
	('MT010', 'S024', 1),
	('MT011', 'S018', 1),
	('MT011', 'S035', 1),
	('MT012', 'S009', 1),
	('MT013', 'S019', 1),
	('MT013', 'S036', 1),
	('MT014', 'S026', 2),
	('MT015', 'S013', 1),
	('MT015', 'S029', 1),
	('MT016', 'S021', 1),
	('MT017', 'S032', 1),
	('MT017', 'S037', 1),
	('MT018', 'S023', 2),
	('MT019', 'S010', 1),
	('MT019', 'S034', 1),
	('MT020', 'S027', 1),
	('MT021', 'S012', 1),
	('MT021', 'S038', 1),
	('MT022', 'S033', 2),
	('MT023', 'S014', 1),
	('MT023', 'S039', 1),
	('MT024', 'S006', 1),
	('MT024', 'S040', 1),
	('MT025', 'S008', 1);

-- Dumping structure for table dbqltv.docgia
CREATE TABLE IF NOT EXISTS `docgia` (
  `MaDG` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `MaKhoa` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `MaLop` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `TenDG` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `NamSinh` varchar(10) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `GioiTinh` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `DiaChi` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `Email` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `Sdt` varchar(13) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`MaDG`),
  KEY `MaKhoa` (`MaKhoa`),
  KEY `MaLop` (`MaLop`),
  CONSTRAINT `docgia_ibfk_1` FOREIGN KEY (`MaKhoa`) REFERENCES `khoa` (`MaKhoa`),
  CONSTRAINT `docgia_ibfk_2` FOREIGN KEY (`MaLop`) REFERENCES `lop` (`MaLop`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.docgia: ~7 rows (approximately)
INSERT INTO `docgia` (`MaDG`, `MaKhoa`, `MaLop`, `TenDG`, `NamSinh`, `GioiTinh`, `DiaChi`, `Email`, `Sdt`) VALUES
	('DG001', 'KH001', 'L004', 'Ngọc Bích', '2005', 'Nữ', 'Hà Nội', 'nb@gmail.com', '0393916176'),
	('DG002', 'KH001', 'L001', 'Nguyễn Ngọc Bích', '2004', 'Nữ', 'Hà Nội', 'bichnn02@gmail.com', '0393916177'),
	('DG003', 'KH001', 'L001', 'Nguyễn Ngọc Linh', '2004', 'Nữ', 'Hà Nội', 'linhnn05@gmail.com', '0367123456'),
	('DG004', 'KH001', 'L002', 'Lưu Đức Anh Dũng', '2003', 'Nam', 'Hà Nội', 'dunglda06@gmail.com', '0356123456'),
	('DG005', 'KH001', 'L003', 'Đinh Hoàng Đức', '2003', 'Nam', 'Hà Nội', 'ducdh07@gmail.com', '0345123456'),
	('DG006', 'KH001', 'L001', 'Nguyễn Nam Khánh', '2003', 'Nam', 'Hà Nội', 'khanhnn08@gmail.com', '0334123456'),
	('DG007', 'KH001', 'L005', 'Phạm Minh Quân', '2005', 'Nam', 'Bắc Ninh', 'quan.pm@utt.edu.vn', '0945088052'),
	('DG008', 'KH002', 'L022', 'Trần Quốc Bảo', '2004', 'Nam', 'Hải Dương', 'bao.tq@utt.edu.vn', '0912345608'),
	('DG009', 'KH002', 'L024', 'Đỗ Anh Tuấn', '2005', 'Nam', 'Nam Định', 'tuan.da@utt.edu.vn', '0912345609'),
	('DG010', 'KH003', 'L026', 'Vũ Khánh Ly', '2005', 'Nữ', 'Hà Nội', 'ly.vk@utt.edu.vn', '0912345610'),
	('DG011', 'KH003', 'L027', 'Lê Thu Trang', '2004', 'Nữ', 'Thái Bình', 'trang.lt@utt.edu.vn', '0912345611'),
	('DG012', 'KH004', 'L018', 'Nguyễn Đức Thành', '2004', 'Nam', 'Ninh Bình', 'thanh.nd@utt.edu.vn', '0912345612'),
	('DG013', 'KH004', 'L020', 'Bùi Minh Châu', '2005', 'Nữ', 'Thanh Hóa', 'chau.bm@utt.edu.vn', '0912345613'),
	('DG014', 'KH005', 'L014', 'Phan Hoàng Long', '2004', 'Nam', 'Hưng Yên', 'long.ph@utt.edu.vn', '0912345614'),
	('DG015', 'KH005', 'L016', 'Đặng Ngọc Mai', '2005', 'Nữ', 'Hà Nam', 'mai.dn@utt.edu.vn', '0912345615'),
	('DG016', 'KH006', 'L034', 'Hoàng Gia Huy', '2004', 'Nam', 'Vĩnh Phúc', 'huy.hg@utt.edu.vn', '0912345616'),
	('DG017', 'KH006', 'L036', 'Ngô Phương Thảo', '2005', 'Nữ', 'Phú Thọ', 'thao.np@utt.edu.vn', '0912345617'),
	('DG018', 'KH008', 'L030', 'Đinh Tiến Dũng', '2004', 'Nam', 'Hải Phòng', 'dung.dt@utt.edu.vn', '0912345618'),
	('DG019', 'KH008', 'L032', 'Trịnh Hà My', '2005', 'Nữ', 'Quảng Ninh', 'my.th@utt.edu.vn', '0912345619'),
	('DG020', 'KH001', 'L007', 'Mai Trung Kiên', '2005', 'Nam', 'Hà Nội', 'kien.mt@utt.edu.vn', '0912345620'),
	('DG021', 'KH001', 'L010', 'Chu Quỳnh Anh', '2004', 'Nữ', 'Bắc Giang', 'anh.cq@utt.edu.vn', '0912345621'),
	('DG022', 'KH002', 'L025', 'Tạ Văn Nam', '2005', 'Nam', 'Thái Nguyên', 'nam.tv@utt.edu.vn', '0912345622'),
	('DG023', 'KH003', 'L028', 'Dương Bảo Ngọc', '2004', 'Nữ', 'Lào Cai', 'ngoc.db@utt.edu.vn', '0912345623'),
	('DG024', 'KH004', 'L021', 'Đào Công Minh', '2005', 'Nam', 'Nghệ An', 'minh.dc@utt.edu.vn', '0912345624'),
	('DG025', 'KH006', 'L037', 'Lý Thanh Hằng', '2005', 'Nữ', 'Hà Tĩnh', 'hang.lt@utt.edu.vn', '0912345625');

-- Dumping structure for table dbqltv.kesach
CREATE TABLE IF NOT EXISTS `kesach` (
  `MaViTri` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `TenKe` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `MoTa` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`MaViTri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.kesach: ~7 rows (approximately)
INSERT INTO `kesach` (`MaViTri`, `TenKe`, `MoTa`) VALUES
	('KS001', 'Kệ CNTT', 'Sách Công nghệ thông tin'),
	('KS002', 'Kệ CKĐL', 'Sách Cơ khí động lực'),
	('KS003', 'Kệ CT', 'Sách Công trình'),
	('KS004', 'Kệ KTVT', 'Sách Kinh tế vận tải'),
	('KS005', 'Kệ KHUD & LCT', 'Luật – Chính trị – Khoa học ứng dụng'),
	('KS006', 'Kệ Văn học', 'Sách văn học'),
	('KS007', 'Kệ Quốc tế', 'Sách học thuật nước ngoài');

-- Dumping structure for table dbqltv.khoa
CREATE TABLE IF NOT EXISTS `khoa` (
  `MaKhoa` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `TenKhoa` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`MaKhoa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.khoa: ~12 rows (approximately)
INSERT INTO `khoa` (`MaKhoa`, `TenKhoa`) VALUES
	('KH001', 'Công nghệ thông tin'),
	('KH002', 'Cơ khí động lực'),
	('KH003', 'Ngôn ngữ Anh'),
	('KH004', 'Công trình'),
	('KH005', 'Điện tử viễn thông'),
	('KH006', 'Kinh tế vận tải'),
	('KH007', 'Luật'),
	('KH008', 'Logistics & Chuỗi cung ứng'),
	('KH009', 'Tự động hóa'),
	('KH010', 'Khoa học ứng dụng'),
	('KH011', 'Quản trị kinh doanh'),
	('KH012', 'Tài chính – Ngân hàng');

-- Dumping structure for table dbqltv.lop
CREATE TABLE IF NOT EXISTS `lop` (
  `MaLop` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `TenLop` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `MaKhoa` varchar(10) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  PRIMARY KEY (`MaLop`),
  KEY `MaKhoa` (`MaKhoa`),
  CONSTRAINT `lop_ibfk_1` FOREIGN KEY (`MaKhoa`) REFERENCES `khoa` (`MaKhoa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.lop: ~36 rows (approximately)
INSERT INTO `lop` (`MaLop`, `TenLop`, `MaKhoa`) VALUES
	('L001', '74DCHT21', 'KH001'),
	('L002', '74DCHT22', 'KH001'),
	('L003', '74DCHT23', 'KH001'),
	('L004', '73DCHT21', 'KH001'),
	('L005', '73DCHT22', 'KH001'),
	('L006', '73DCHT23', 'KH001'),
	('L007', '74DCHT24', 'KH001'),
	('L008', '74DCHT25', 'KH001'),
	('L009', '74DCHT26', 'KH001'),
	('L010', '73DCTT21', 'KH001'),
	('L011', '73DCTT22', 'KH001'),
	('L012', '74DCTT24', 'KH001'),
	('L014', '73DDTVT21', 'KH005'),
	('L015', '73DDTVT22', 'KH005'),
	('L016', '74DDTVT24', 'KH005'),
	('L017', '74DDTVT25', 'KH005'),
	('L018', '73DCCT21', 'KH004'),
	('L019', '73DCCT22', 'KH004'),
	('L020', '74DCCT24', 'KH004'),
	('L021', '74DCCT25', 'KH004'),
	('L022', '73DCKDL01', 'KH002'),
	('L023', '73DCKDL02', 'KH002'),
	('L024', '74DCKDL01', 'KH002'),
	('L025', '74DCKDL02', 'KH002'),
	('L026', '74DCNN21', 'KH003'),
	('L027', '73DCNN21', 'KH003'),
	('L028', '73DCNN22', 'KH003'),
	('L029', '73DCLG02', 'KH003'),
	('L030', '73DCL01', 'KH008'),
	('L031', '73DCL02', 'KH008'),
	('L032', '74DCL01', 'KH008'),
	('L033', '74DCL02', 'KH008'),
	('L034', '73DKTVT01', 'KH006'),
	('L035', '73DKTVT02', 'KH006'),
	('L036', '74DKTVT01', 'KH006'),
	('L037', '74DKTVT02', 'KH006');

-- Dumping structure for table dbqltv.muontra
CREATE TABLE IF NOT EXISTS `muontra` (
  `MaMT` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `MaDG` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `MaNV` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `NgayMuon` date DEFAULT NULL,
  `HanTra` date NOT NULL,
  `NgayTra` date DEFAULT NULL,
  `TrangThai` varchar(20) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  PRIMARY KEY (`MaMT`),
  KEY `MaDG` (`MaDG`),
  KEY `MaNV` (`MaNV`),
  CONSTRAINT `muontra_ibfk_1` FOREIGN KEY (`MaDG`) REFERENCES `docgia` (`MaDG`),
  CONSTRAINT `muontra_ibfk_2` FOREIGN KEY (`MaNV`) REFERENCES `nhanvien` (`MaNV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.muontra: ~3 rows (approximately)
INSERT INTO `muontra` (`MaMT`, `MaDG`, `MaNV`, `NgayMuon`, `HanTra`, `NgayTra`, `TrangThai`) VALUES
	('MT001', 'DG001', 'NV001', '2026-01-05', '2026-01-06', NULL, 'Đang mượn'),
	('MT002', 'DG002', 'NV001', '2026-01-01', '2026-01-02', NULL, 'Đang mượn'),
	('MT003', 'DG002', 'NV001', '2026-01-01', '2026-01-22', NULL, 'Đang mượn'),
	('MT004', 'DG004', 'NV002', '2025-09-03', '2025-09-17', '2025-09-15', 'Đã trả'),
	('MT005', 'DG005', 'NV002', '2025-09-18', '2025-10-02', '2025-10-06', 'Đã trả'),
	('MT006', 'DG006', 'NV001', '2025-10-06', '2025-10-20', '2025-10-20', 'Đã trả'),
	('MT007', 'DG007', 'NV003', '2025-10-22', '2025-11-05', '2025-11-02', 'Đã trả'),
	('MT008', 'DG008', 'NV003', '2025-11-10', '2025-11-24', '2025-11-28', 'Đã trả'),
	('MT009', 'DG009', 'NV002', '2025-12-01', '2025-12-15', '2025-12-12', 'Đã trả'),
	('MT010', 'DG010', 'NV001', '2025-12-15', '2025-12-29', '2026-01-03', 'Đã trả'),
	('MT011', 'DG011', 'NV004', '2026-01-12', '2026-01-26', '2026-01-24', 'Đã trả'),
	('MT012', 'DG012', 'NV002', '2026-02-02', '2026-02-16', '2026-02-16', 'Đã trả'),
	('MT013', 'DG013', 'NV003', '2026-02-18', '2026-03-04', '2026-03-10', 'Đã trả'),
	('MT014', 'DG014', 'NV001', '2026-03-02', '2026-03-16', '2026-03-14', 'Đã trả'),
	('MT015', 'DG015', 'NV004', '2026-03-20', '2026-04-03', '2026-04-03', 'Đã trả'),
	('MT016', 'DG016', 'NV002', '2026-04-06', '2026-04-20', '2026-04-25', 'Đã trả'),
	('MT017', 'DG017', 'NV003', '2026-04-22', '2026-05-06', '2026-05-05', 'Đã trả'),
	('MT018', 'DG018', 'NV001', '2026-05-04', '2026-05-18', '2026-05-18', 'Đã trả'),
	('MT019', 'DG019', 'NV004', '2026-05-20', '2026-06-03', '2026-06-08', 'Đã trả'),
	('MT020', 'DG020', 'NV002', '2026-06-01', '2026-06-15', NULL, 'Đang mượn'),
	('MT021', 'DG021', 'NV003', '2026-06-08', '2026-06-22', NULL, 'Đang mượn'),
	('MT022', 'DG022', 'NV001', '2026-06-18', '2026-07-02', NULL, 'Đang mượn'),
	('MT023', 'DG023', 'NV004', '2026-06-20', '2026-07-04', NULL, 'Đang mượn'),
	('MT024', 'DG024', 'NV002', '2026-06-23', '2026-07-07', NULL, 'Đang mượn'),
	('MT025', 'DG025', 'NV003', '2026-06-25', '2026-07-09', NULL, 'Đang mượn');

-- Dumping structure for table dbqltv.ngonngu
CREATE TABLE IF NOT EXISTS `ngonngu` (
  `MaNN` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `TenNN` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`MaNN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.ngonngu: ~9 rows (approximately)
INSERT INTO `ngonngu` (`MaNN`, `TenNN`) VALUES
	('NN001', 'Tiếng Việt'),
	('NN002', 'Tiếng Anh'),
	('NN003', 'Tiếng Pháp'),
	('NN004', 'Tiếng Trung'),
	('NN005', 'Tiếng Nhật'),
	('NN006', 'Tiếng Hàn'),
	('NN007', 'Tiếng Nga'),
	('NN008', 'Tiếng Đức'),
	('NN009', 'Tiếng Tây Ban Nha');

-- Dumping structure for table dbqltv.nhanvien
CREATE TABLE IF NOT EXISTS `nhanvien` (
  `MaNV` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `TenNV` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `QueQuan` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `GioiTinh` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `NamSinh` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `VaiTro` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `Email` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `Sdt` varchar(13) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `User` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `Pass` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`MaNV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.nhanvien: ~4 rows (approximately)
INSERT INTO `nhanvien` (`MaNV`, `TenNV`, `QueQuan`, `GioiTinh`, `NamSinh`, `VaiTro`, `Email`, `Sdt`, `User`, `Pass`) VALUES
	('NV001', 'Trần Hải', 'Hà Nội', 'Nam', '1999', 'Quản lý', 'hai.tran@utt.edu.vn', '0987654321', 'nv1', '123'),
	('NV002', 'Hà Phương', 'Hải Phòng', 'Nữ', '2000', 'Thủ thư', 'haphuong@gmail.com', '0123456789', 'nv2', '1234'),
	('NV003', 'Nguyễn Thu Hà', 'Nam Định', 'Nữ', '1998', 'Thủ thư', 'ha.nguyen@utt.edu.vn', '0945088056', 'nv3', '1234'),
	('NV004', 'Phạm Đức Minh', 'Bắc Ninh', 'Nam', '1997', 'Thủ thư', 'minh.pham@utt.edu.vn', '0123456788', 'nv4', '1234');

-- Dumping structure for table dbqltv.nhaxuatban
CREATE TABLE IF NOT EXISTS `nhaxuatban` (
  `MaNXB` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `TenNXB` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `DiaChi` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `Email` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `Sdt` varchar(13) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  PRIMARY KEY (`MaNXB`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.nhaxuatban: ~16 rows (approximately)
INSERT INTO `nhaxuatban` (`MaNXB`, `TenNXB`, `DiaChi`, `Email`, `Sdt`) VALUES
	('NXB001', 'NXB Giáo Dục Việt Nam', 'Hà Nội', 'giaoduc@nxb.vn', '02438220801'),
	('NXB002', 'NXB Trẻ', 'TP. Hồ Chí Minh', 'nxbtre@nxb.vn', '02838291145'),
	('NXB003', 'NXB Kim Đồng', 'Hà Nội', 'kimdong@nxb.vn', '02439432856'),
	('NXB004', 'NXB Lao Động', 'Hà Nội', 'laodong@nxb.vn', '02437336888'),
	('NXB005', 'NXB Văn Học', 'Hà Nội', 'vanhoc@nxb.vn', '02439422123'),
	('NXB006', 'NXB Khoa Học & Kỹ Thuật', 'Hà Nội', 'khkt@nxb.vn', '02438692222'),
	('NXB007', 'NXB Chính Trị Quốc Gia', 'Hà Nội', 'chinhtri@nxb.vn', '02437423333'),
	('NXB008', 'NXB Thống Kê', 'Hà Nội', 'thongke@nxb.vn', '02437324444'),
	('NXB009', 'NXB Tổng Hợp TP.HCM', 'TP. Hồ Chí Minh', 'tonghop@nxb.vn', '02838339999'),
	('NXB010', 'NXB Phụ Nữ', 'Hà Nội', 'phunu@nxb.vn', '02439281111'),
	('NXB011', 'NXB Công Thương', 'Hà Nội', 'congthuong@nxb.vn', '02438336666'),
	('NXB012', 'NXB Đại Học Quốc Gia Hà Nội', 'Hà Nội', 'dhqghn@nxb.vn', '02437548888'),
	('NXB013', 'NXB Đại Học Quốc Gia TP.HCM', 'TP. Hồ Chí Minh', 'dhqgtphcm@nxb.vn', '02837221111'),
	('NXB014', 'NXB Xây Dựng', 'Hà Nội', 'xaydung@nxb.vn', '02438775555'),
	('NXB015', 'NXB Giao Thông Vận Tải', 'Hà Nội', 'gtvt@nxb.vn', '02439429999'),
	('NXB016', 'NXB Bách Khoa Hà Nội', 'Hà Nội', 'bachkhoa@nxb.vn', '02438684569');

-- Dumping structure for table dbqltv.sach
CREATE TABLE IF NOT EXISTS `sach` (
  `MaSach` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `MaTG` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `MaNXB` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `MaTL` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `TenSach` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `NamXB` int NOT NULL,
  `SoLuong` int DEFAULT NULL,
  `MaNN` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `MaViTri` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`MaSach`),
  KEY `MaTG` (`MaTG`),
  KEY `MaNXB` (`MaNXB`),
  KEY `MaTL` (`MaTL`),
  KEY `MaNN` (`MaNN`),
  KEY `MaViTri` (`MaViTri`),
  CONSTRAINT `sach_ibfk_1` FOREIGN KEY (`MaTG`) REFERENCES `tacgia` (`MaTG`),
  CONSTRAINT `sach_ibfk_2` FOREIGN KEY (`MaNXB`) REFERENCES `nhaxuatban` (`MaNXB`),
  CONSTRAINT `sach_ibfk_3` FOREIGN KEY (`MaTL`) REFERENCES `theloai` (`MaTL`),
  CONSTRAINT `sach_ibfk_4` FOREIGN KEY (`MaNN`) REFERENCES `ngonngu` (`MaNN`),
  CONSTRAINT `sach_ibfk_5` FOREIGN KEY (`MaViTri`) REFERENCES `kesach` (`MaViTri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.sach: ~14 rows (approximately)
INSERT INTO `sach` (`MaSach`, `MaTG`, `MaNXB`, `MaTL`, `TenSach`, `NamXB`, `SoLuong`, `MaNN`, `MaViTri`) VALUES
	('S001', 'TG005', 'NXB001', 'TL006', 'Lập trình Java cơ bản', 2021, 20, 'NN001', 'KS001'),
	('S002', 'TG006', 'NXB001', 'TL006', 'Lập trình Java nâng cao', 2022, 15, 'NN001', 'KS001'),
	('S003', 'TG009', 'NXB009', 'TL006', 'Cơ sở dữ liệu', 2020, 18, 'NN001', 'KS001'),
	('S004', 'TG009', 'NXB009', 'TL006', 'Hệ điều hành', 2019, 12, 'NN001', 'KS001'),
	('S005', 'TG002', 'NXB004', 'TL005', 'Nguyên lý động cơ', 2018, 10, 'NN001', 'KS002'),
	('S006', 'TG002', 'NXB004', 'TL005', 'Hệ thống truyền động', 2019, 8, 'NN001', 'KS002'),
	('S007', 'TG003', 'NXB014', 'TL016', 'Kết cấu bê tông', 2020, 14, 'NN001', 'KS003'),
	('S008', 'TG003', 'NXB014', 'TL016', 'Cơ học đất', 2019, 9, 'NN001', 'KS003'),
	('S009', 'TG008', 'NXB006', 'TL007', 'Kinh tế vận tải', 2021, 16, 'NN001', 'KS004'),
	('S010', 'TG008', 'NXB006', 'TL007', 'Logistics căn bản', 2022, 20, 'NN001', 'KS004'),
	('S011', 'TG001', 'NXB005', 'TL001', 'Cho tôi xin một vé đi tuổi thơ', 2015, 25, 'NN001', 'KS006'),
	('S012', 'TG002', 'NXB005', 'TL001', 'Chí Phèo', 2014, 30, 'NN001', 'KS006'),
	('S013', 'TG006', 'NXB003', 'TL002', 'Harry Potter', 2010, 18, 'NN002', 'KS007'),
	('S014', 'TG009', 'NXB003', 'TL002', 'The Da Vinci Code', 2012, 12, 'NN002', 'KS007'),
	('S015', 'TG015', 'NXB012', 'TL006', 'Cấu trúc dữ liệu và giải thuật', 2023, 22, 'NN001', 'KS001'),
	('S016', 'TG015', 'NXB012', 'TL006', 'Nhập môn trí tuệ nhân tạo', 2024, 16, 'NN001', 'KS001'),
	('S017', 'TG016', 'NXB016', 'TL006', 'Mạng máy tính hiện đại', 2022, 14, 'NN001', 'KS001'),
	('S018', 'TG016', 'NXB016', 'TL006', 'An toàn thông tin căn bản', 2023, 11, 'NN001', 'KS001'),
	('S019', 'TG017', 'NXB006', 'TL005', 'Điện tử công suất', 2021, 13, 'NN001', 'KS002'),
	('S020', 'TG017', 'NXB006', 'TL005', 'Điều khiển tự động', 2022, 17, 'NN001', 'KS002'),
	('S021', 'TG018', 'NXB014', 'TL016', 'Thiết kế cầu bê tông cốt thép', 2020, 10, 'NN001', 'KS003'),
	('S022', 'TG018', 'NXB014', 'TL016', 'Kỹ thuật thi công công trình', 2023, 15, 'NN001', 'KS003'),
	('S023', 'TG019', 'NXB015', 'TL007', 'Quản trị chuỗi cung ứng', 2024, 20, 'NN001', 'KS004'),
	('S024', 'TG019', 'NXB015', 'TL007', 'Vận tải đa phương thức', 2022, 12, 'NN001', 'KS004'),
	('S025', 'TG020', 'NXB011', 'TL008', 'Quản trị chiến lược', 2021, 18, 'NN001', 'KS004'),
	('S026', 'TG020', 'NXB011', 'TL009', 'Marketing số', 2024, 24, 'NN001', 'KS004'),
	('S027', 'TG021', 'NXB008', 'TL010', 'Tài chính doanh nghiệp', 2023, 19, 'NN001', 'KS004'),
	('S028', 'TG021', 'NXB008', 'TL010', 'Phân tích đầu tư', 2022, 9, 'NN001', 'KS004'),
	('S029', 'TG022', 'NXB007', 'TL011', 'Pháp luật đại cương', 2023, 26, 'NN001', 'KS005'),
	('S030', 'TG022', 'NXB007', 'TL011', 'Luật giao thông đường bộ', 2024, 21, 'NN001', 'KS005'),
	('S031', 'TG007', 'NXB005', 'TL002', 'Rừng Na Uy', 2018, 14, 'NN001', 'KS006'),
	('S032', 'TG010', 'NXB005', 'TL002', 'Án mạng trên chuyến tàu tốc hành', 2019, 16, 'NN001', 'KS006'),
	('S033', 'TG011', 'NXB005', 'TL002', 'Những cuộc phiêu lưu của Sherlock Holmes', 2020, 18, 'NN001', 'KS006'),
	('S034', 'TG013', 'NXB005', 'TL002', 'Những người khốn khổ', 2017, 12, 'NN001', 'KS006'),
	('S035', 'TG014', 'NXB005', 'TL002', 'Chiến tranh và hòa bình', 2016, 8, 'NN001', 'KS006'),
	('S036', 'TG012', 'NXB005', 'TL002', 'Ông già và biển cả', 2021, 15, 'NN001', 'KS006'),
	('S037', 'TG006', 'NXB003', 'TL002', 'Harry Potter and the Prisoner of Azkaban', 2015, 10, 'NN002', 'KS007'),
	('S038', 'TG009', 'NXB009', 'TL002', 'Digital Fortress', 2018, 9, 'NN002', 'KS007'),
	('S039', 'TG007', 'NXB009', 'TL002', 'Kafka on the Shore', 2019, 7, 'NN002', 'KS007'),
	('S040', 'TG023', 'NXB012', 'TL015', 'English for Transport Engineering', 2024, 20, 'NN002', 'KS007');

-- Dumping structure for table dbqltv.tacgia
CREATE TABLE IF NOT EXISTS `tacgia` (
  `MaTG` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `TenTG` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `NamSinh` varchar(11) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `GioiTinh` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `QuocTich` varchar(30) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`MaTG`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.tacgia: ~14 rows (approximately)
INSERT INTO `tacgia` (`MaTG`, `TenTG`, `NamSinh`, `GioiTinh`, `QuocTich`) VALUES
	('TG001', 'Nguyễn Nhật Ánh', '1955', 'Nam', 'Việt Nam'),
	('TG002', 'Nam Cao', '1915', 'Nam', 'Việt Nam'),
	('TG003', 'Tô Hoài', '1920', 'Nam', 'Việt Nam'),
	('TG004', 'Xuân Diệu', '1916', 'Nam', 'Việt Nam'),
	('TG005', 'Nguyễn Du', '1765', 'Nam', 'Việt Nam'),
	('TG006', 'J.K. Rowling', '1965', 'Nữ', 'Anh'),
	('TG007', 'Haruki Murakami', '1949', 'Nam', 'Nhật Bản'),
	('TG008', 'Paulo Coelho', '1947', 'Nam', 'Brazil'),
	('TG009', 'Dan Brown', '1964', 'Nam', 'Mỹ'),
	('TG010', 'Agatha Christie', '1890', 'Nữ', 'Anh'),
	('TG011', 'Arthur Conan Doyle', '1859', 'Nam', 'Anh'),
	('TG012', 'Ernest Hemingway', '1899', 'Nam', 'Mỹ'),
	('TG013', 'Victor Hugo', '1802', 'Nam', 'Pháp'),
	('TG014', 'Lev Tolstoy', '1828', 'Nam', 'Nga'),
	('TG015', 'Lê Minh Hoàng', '1978', 'Nam', 'Việt Nam'),
	('TG016', 'Nguyễn Văn Tam', '1975', 'Nam', 'Việt Nam'),
	('TG017', 'Trần Quang Vinh', '1972', 'Nam', 'Việt Nam'),
	('TG018', 'Phạm Duy Hòa', '1968', 'Nam', 'Việt Nam'),
	('TG019', 'Đặng Đình Đào', '1956', 'Nam', 'Việt Nam'),
	('TG020', 'Nguyễn Hoàng Long', '1974', 'Nam', 'Việt Nam'),
	('TG021', 'Phan Thị Thu Hà', '1976', 'Nữ', 'Việt Nam'),
	('TG022', 'Vũ Văn Mẫu', '1914', 'Nam', 'Việt Nam'),
	('TG023', 'Sarah Cunningham', '1967', 'Nữ', 'Anh');

-- Dumping structure for table dbqltv.theloai
CREATE TABLE IF NOT EXISTS `theloai` (
  `MaTL` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `TenTL` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`MaTL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.theloai: ~19 rows (approximately)
INSERT INTO `theloai` (`MaTL`, `TenTL`) VALUES
	('TL001', 'Văn học Việt Nam'),
	('TL002', 'Văn học nước ngoài'),
	('TL003', 'Thiếu nhi'),
	('TL004', 'Giáo trình'),
	('TL005', 'Khoa học'),
	('TL006', 'Công nghệ thông tin'),
	('TL007', 'Kinh tế'),
	('TL008', 'Quản trị kinh doanh'),
	('TL009', 'Marketing'),
	('TL010', 'Tài chính – Ngân hàng'),
	('TL011', 'Luật'),
	('TL012', 'Y học'),
	('TL013', 'Tâm lý học'),
	('TL014', 'Kỹ năng sống'),
	('TL015', 'Ngoại ngữ'),
	('TL016', 'Lịch sử'),
	('TL017', 'Địa lý'),
	('TL018', 'Triết học'),
	('TL019', 'Văn hóa – Xã hội');

-- Dumping structure for table dbqltv.thethuvien
CREATE TABLE IF NOT EXISTS `thethuvien` (
  `MaThe` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `MaDG` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `NgayCap` date NOT NULL,
  `NgayHetHan` date NOT NULL,
  `TrangThai` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`MaThe`),
  KEY `MaDG` (`MaDG`),
  CONSTRAINT `thethuvien_ibfk_1` FOREIGN KEY (`MaDG`) REFERENCES `docgia` (`MaDG`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table dbqltv.thethuvien: ~3 rows (approximately)
INSERT INTO `thethuvien` (`MaThe`, `MaDG`, `NgayCap`, `NgayHetHan`, `TrangThai`) VALUES
	('TTV001', 'DG001', '2025-06-01', '2025-07-02', 'Hết hạn'),
	('TTV002', 'DG002', '2026-01-01', '2027-01-01', 'Còn hiệu lực'),
	('TTV003', 'DG003', '2025-11-11', '2026-11-11', 'Còn hiệu lực'),
	('TTV004', 'DG004', '2025-09-01', '2026-09-01', 'Còn hiệu lực'),
	('TTV005', 'DG005', '2024-09-05', '2025-09-05', 'Hết hạn'),
	('TTV006', 'DG006', '2026-01-10', '2027-01-10', 'Còn hiệu lực'),
	('TTV007', 'DG007', '2025-10-15', '2026-10-15', 'Còn hiệu lực'),
	('TTV008', 'DG008', '2024-11-01', '2025-11-01', 'Hết hạn'),
	('TTV009', 'DG009', '2026-02-01', '2027-02-01', 'Còn hiệu lực'),
	('TTV010', 'DG010', '2025-08-20', '2026-08-20', 'Còn hiệu lực'),
	('TTV011', 'DG011', '2024-12-12', '2025-12-12', 'Hết hạn'),
	('TTV012', 'DG012', '2026-03-01', '2027-03-01', 'Còn hiệu lực'),
	('TTV013', 'DG013', '2025-09-18', '2026-09-18', 'Còn hiệu lực'),
	('TTV014', 'DG014', '2025-01-15', '2026-01-15', 'Hết hạn'),
	('TTV015', 'DG015', '2026-04-01', '2027-04-01', 'Còn hiệu lực'),
	('TTV016', 'DG016', '2025-10-06', '2026-10-06', 'Còn hiệu lực'),
	('TTV017', 'DG017', '2024-10-10', '2025-10-10', 'Hết hạn'),
	('TTV018', 'DG018', '2026-04-20', '2027-04-20', 'Còn hiệu lực'),
	('TTV019', 'DG019', '2025-11-05', '2026-11-05', 'Còn hiệu lực'),
	('TTV020', 'DG020', '2025-02-14', '2026-02-14', 'Hết hạn'),
	('TTV021', 'DG021', '2026-05-01', '2027-05-01', 'Còn hiệu lực'),
	('TTV022', 'DG022', '2025-12-01', '2026-12-01', 'Còn hiệu lực'),
	('TTV023', 'DG023', '2024-12-20', '2025-12-20', 'Hết hạn'),
	('TTV024', 'DG024', '2026-05-15', '2027-05-15', 'Còn hiệu lực'),
	('TTV025', 'DG025', '2026-06-01', '2027-06-01', 'Còn hiệu lực');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
