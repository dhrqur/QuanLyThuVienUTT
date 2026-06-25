# Hệ thống Quản lý Thư viện

Ứng dụng web quản lý thư viện theo mô hình client–server, gồm:

- `FE_QLTV`: giao diện React/Vite.
- `BE_QLTV_API`: REST API Node.js/Express và cơ sở dữ liệu MySQL.

Hệ thống hỗ trợ quản lý sách, độc giả, nhân viên, thẻ thư viện, danh mục liên quan và toàn bộ nghiệp vụ mượn–trả sách.

## Chức năng chính

- Đăng nhập và phân quyền `Quản lý` / `Thủ thư`.
- Dashboard thống kê tổng quan dành cho quản lý.
- Quản lý sách, tác giả, thể loại, nhà xuất bản, ngôn ngữ và kệ sách.
- Quản lý độc giả, khoa, lớp và thẻ thư viện.
- Quản lý nhân viên.
- Lập phiếu mượn gồm nhiều đầu sách và số lượng tương ứng.
- Tự động trừ tồn kho khi mượn và hoàn tồn kho khi trả.
- Tự tính trạng thái `Đang mượn`, `Quá hạn`, `Đã trả`.
- Ghi nhận ngày trả và tính tiền phạt `2.000 đồng/ngày` khi quá hạn.
- Tìm kiếm, xem chi tiết, thêm, sửa và xóa dữ liệu.
- Validation ở FE và BE, thông báo thành công/thất bại bằng toast.
- Swagger UI để xem và thử API.

## Công nghệ

### Frontend

- React 19
- Vite 8
- React Router
- Axios
- Tailwind CSS 4
- Radix UI / shadcn
- Lucide React
- Sonner

### Backend

- Node.js
- Express 5
- MySQL
- mysql2
- CORS
- Swagger UI
- Nodemon

## Cấu trúc dự án

```text
QLTV_FULL/
├── FE_QLTV/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── views/
│   └── package.json
├── BE_QLTV_API/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   │   ├── entities/
│   │   │   └── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── .env.example
│   ├── qltv.sql
│   └── package.json
└── README.md
```

## Yêu cầu môi trường

- Node.js 18 trở lên.
- npm 9 trở lên.
- MySQL 8.x hoặc phiên bản tương thích.

## Cài đặt

### 1. Khởi tạo cơ sở dữ liệu

Chạy file SQL bằng MySQL:

```bash
mysql -u root -p < BE_QLTV_API/qltv.sql
```

File SQL sẽ tạo database `qltv`, các bảng và dữ liệu mẫu.

### 2. Cấu hình backend

Di chuyển vào thư mục backend:

```bash
cd BE_QLTV_API
npm install
```

Tạo `.env` từ `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=qltv
```

Điền `DB_PASSWORD` theo tài khoản MySQL trên máy.

Khởi động backend:

```bash
npm run dev
```

Backend chạy tại:

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api-docs`

### 3. Cài đặt frontend

Mở terminal khác:

```bash
cd FE_QLTV
npm install
npm run dev
```

Frontend chạy tại `http://localhost:5173`.

Backend hiện cho phép CORS từ đúng địa chỉ này.

Tài liệu giải thích cấu trúc, luồng dữ liệu và cách thêm màn hình frontend mới nằm tại
[`FE_QLTV/README.md`](FE_QLTV/README.md).

## Tài khoản mẫu

| Vai trò | Tên đăng nhập | Mật khẩu |
| --- | --- | --- |
| Quản lý | `nv1` | `123` |
| Thủ thư | `nv2` | `1234` |

Quản lý được truy cập Dashboard và quản lý nhân viên. Thủ thư được sử dụng các màn hình nghiệp vụ thư viện còn lại.

## Các module API

```text
sach
nhanvien
docgia
theloai
tacgia
nhaxuatban
kesach
khoa
lop
ngonngu
thethuvien
muontra
chitietmuontra
thongke
```

Các module quản lý thông thường hỗ trợ:

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| GET | `/api/<module>` | Lấy danh sách |
| GET | `/api/<module>/tim-kiem?keyword=...` | Tìm kiếm |
| GET | `/api/<module>/thong-ke` | Thống kê module |
| GET | `/api/<module>/<id>` | Lấy chi tiết |
| POST | `/api/<module>` | Thêm mới |
| PUT | `/api/<module>/<id>` | Cập nhật |
| DELETE | `/api/<module>/<id>` | Xóa |

Endpoint riêng:

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| POST | `/api/nhanvien/dang-nhap` | Đăng nhập |
| PUT | `/api/muontra/:maMT/tra-sach` | Trả sách |
| GET | `/api/thongke/tong-quan` | Thống kê Dashboard |
| GET | `/api/chitietmuontra/:maMT/:maSach` | Chi tiết theo khóa ghép |
| PUT | `/api/chitietmuontra/:maMT/:maSach` | Sửa chi tiết theo khóa ghép |
| DELETE | `/api/chitietmuontra/:maMT/:maSach` | Xóa chi tiết theo khóa ghép |

## Nghiệp vụ mượn–trả

1. Phiếu mượn được lưu tại `muontra`.
2. Danh sách sách và số lượng được lưu tại `chitietmuontra`.
3. Khi lập hoặc sửa phiếu, BE kiểm tra tồn kho trong transaction.
4. Khi mượn thành công, số lượng sách trong kho được trừ.
5. Khi trả, `NgayTra` được cập nhật và tồn kho được hoàn lại.
6. Trạng thái được tính tự động từ `NgayTra` và `HanTra`.
7. Nếu trả muộn, tiền phạt bằng số ngày quá hạn nhân `2.000 đồng`.

Các bảng `phieudattruoc` và `phieutra` không được sử dụng. Ngày trả được lưu trực tiếp trong `muontra`.

## Kiểm tra dự án

Frontend:

```bash
cd FE_QLTV
npm run lint
npm run build
```

Backend:

```bash
cd BE_QLTV_API
npm start
```

## Lưu ý

- `API_BASE_URL` của FE hiện là `http://localhost:3000/api`.
- Mật khẩu trong dữ liệu mẫu hiện được lưu dạng văn bản thuần, chỉ phù hợp cho mục đích học tập/demo. Khi triển khai thực tế cần mã hóa mật khẩu và sử dụng cơ chế xác thực bằng token hoặc session.
- Nếu đổi cổng FE hoặc BE, cần cập nhật đồng thời CORS ở BE và `API_BASE_URL` ở FE.

## Nhóm thực hiện

Nhóm 7 – 74DCHT23.
