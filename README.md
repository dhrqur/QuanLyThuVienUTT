# Hệ thống Quản lý Thư viện UTT

Ứng dụng web quản lý thư viện dành cho cán bộ thư viện, được xây dựng theo mô hình React client, REST API và MySQL. Hệ thống bao phủ danh mục sách, độc giả, thẻ thư viện, mượn–trả, xử lý vi phạm, thu tiền phạt, báo cáo và nhật ký hoạt động.

## Tính năng

### Nghiệp vụ thư viện

- Quản lý sách, tác giả, thể loại, nhà xuất bản, ngôn ngữ và kệ sách.
- Tìm kiếm trong danh sách lựa chọn và thêm nhanh dữ liệu liên quan ngay trên form sách.
- Quản lý độc giả theo khoa, lớp và quản lý thẻ thư viện.
- Lập phiếu mượn nhiều đầu sách; tự kiểm tra tồn kho, thẻ còn hiệu lực và điều kiện mượn.
- Tự động trừ tồn kho khi mượn và hoàn kho khi trả.
- Cố định ngày mượn/ngày cấp thẻ theo ngày hiện tại tại Việt Nam.
- Tự cập nhật trạng thái `Đang mượn`, `Quá hạn` và `Đã trả`.
- Khi trả sách, tự ghi nhận quá hạn, hư hỏng hoặc làm mất; tính tiền và cập nhật xử lý vi phạm.
- Theo dõi trạng thái thu tiền: chưa thu, đã thu hoặc miễn phạt.
- Cho phép quản lý cấu hình phí quá hạn, hư hỏng và làm mất.

### Quản trị và an toàn dữ liệu

- Đăng nhập bằng JWT và phân quyền `Quản lý` / `Thủ thư`.
- Mật khẩu được băm bằng bcrypt.
- Chống trùng email, số điện thoại và tên đăng nhập ở cả tầng ứng dụng và database.
- Validation dữ liệu tại frontend và backend; lỗi kỹ thuật/SQL không bị hiển thị trực tiếp cho người dùng.
- Nhật ký hệ thống ghi người thực hiện, hành động thêm/sửa/xóa, đối tượng, nội dung, thời gian và thiết bị.
- Các nghiệp vụ mượn–trả quan trọng chạy trong transaction và khóa dữ liệu cần thiết để tránh sai tồn kho.

### Giao diện và báo cáo

- Dashboard tổng quan, biểu đồ và xuất báo cáo.
- Bảng dữ liệu dùng chung có tìm kiếm, sắp xếp, phân trang, xem chi tiết và CRUD.
- Giao diện responsive, toast thông báo và badge trạng thái.
- Swagger UI để xem và thử REST API.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Axios |
| UI | Tailwind CSS 4, Radix UI, shadcn, Lucide React, Sonner |
| Báo cáo | Recharts, ExcelJS |
| Backend | Node.js, Express 5 |
| Xác thực | JWT, bcrypt |
| Database | MySQL 8, mysql2 |
| Tài liệu API | Swagger UI, swagger-jsdoc |
| Triển khai frontend | Vercel |

## Cấu trúc dự án

```text
QuanLyThuVienUTT/
├── FE_QLTV/                 # React/Vite frontend
│   ├── src/
│   │   ├── components/      # UI và DataTable dùng chung
│   │   ├── hooks/           # Logic gọi API và quản lý state
│   │   ├── lib/             # Axios client
│   │   ├── routes/          # Điều hướng và route bảo vệ
│   │   ├── utils/           # Validation, format, export
│   │   └── views/           # Các màn hình nghiệp vụ
│   └── package.json
├── BE_QLTV_API/             # Express REST API
│   ├── scripts/migrations/  # Migration có thể chạy lại an toàn
│   ├── src/
│   │   ├── config/          # MySQL và Swagger
│   │   ├── controllers/
│   │   ├── middlewares/     # Auth, audit và validation
│   │   ├── models/
│   │   │   ├── entities/
│   │   │   └── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── qltv.sql             # Schema và dữ liệu mẫu
│   └── package.json
├── vercel.json
└── README.md
```

## Phân quyền

| Chức năng | Quản lý | Thủ thư |
| --- | :---: | :---: |
| Danh mục sách và độc giả | ✓ | ✓ |
| Mượn–trả và xử lý vi phạm | ✓ | ✓ |
| Quy định thư viện | Xem/Sửa | Xem |
| Dashboard | ✓ | — |
| Quản lý nhân viên | ✓ | — |
| Nhật ký hệ thống | ✓ | — |

## Yêu cầu môi trường

- Node.js 18 trở lên.
- npm 9 trở lên.
- MySQL 8.x hoặc phiên bản tương thích.

## Cài đặt và chạy local

### 1. Tạo cơ sở dữ liệu

Import file [BE_QLTV_API/qltv.sql](BE_QLTV_API/qltv.sql):

```bash
mysql -u root -p < BE_QLTV_API/qltv.sql
```

File SQL tạo database `qltv`, toàn bộ bảng, ràng buộc và dữ liệu mẫu.

### 2. Chạy backend

```bash
cd BE_QLTV_API
npm install
```

Sao chép `.env.example` thành `.env`, sau đó cấu hình:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=qltv
DB_SSL=false
DB_SSL_CA=
CLIENT_URL=http://localhost:5173
AUTH_SECRET=replace-with-a-long-random-secret
```

Nếu database đã tồn tại từ phiên bản trước, chạy migration chống trùng thông tin liên hệ:

```bash
npm run migrate:unique-contacts
```

Khởi động API:

```bash
npm run dev
```

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api-docs`

### 3. Chạy frontend

Mở terminal khác:

```bash
cd FE_QLTV
npm install
```

Sao chép `.env.example` thành `.env` nếu cần tùy chỉnh địa chỉ API:

```env
VITE_LOCAL_API_URL=http://localhost:3000
VITE_PUBLIC_API_URL=https://your-api.example.com
```

Khởi động giao diện:

```bash
npm run dev
```

Frontend mặc định chạy tại `http://localhost:5173`.

## Tài khoản mẫu

| Vai trò | Tên đăng nhập | Mật khẩu |
| --- | --- | --- |
| Quản lý | `nv1` | `123456` |
| Thủ thư | `nv2` | `123456` |

Chỉ sử dụng các tài khoản này với dữ liệu mẫu. Khi triển khai thật, cần đổi mật khẩu và đặt `AUTH_SECRET` đủ mạnh.

## Luồng mượn–trả và vi phạm

1. Frontend gửi phiếu mượn cùng danh sách sách và số lượng.
2. Backend xác thực nhân viên từ JWT, cố định ngày mượn và kiểm tra thẻ thư viện.
3. Phiếu được lưu vào `muontra`, chi tiết lưu vào `chitietmuontra`; tồn kho được trừ trong cùng transaction.
4. Khi trả sách, hệ thống hoàn tồn kho và ghi ngày trả.
5. Số ngày quá hạn được tính theo hạn trả; hư hỏng và làm mất được nhập theo từng đầu sách.
6. Các khoản phạt được tạo/cập nhật tại `xulyvipham` theo mức phí trong `quydinhthuvien`.
7. Nếu thực hiện thu tiền lúc trả, trạng thái thu, ngày thu và nhân viên thu được ghi nhận ngay.
8. Toàn bộ hành động được lưu vào `nhatkyhethong` để quản lý tra cứu.

## API chính

Mọi endpoint nghiệp vụ, ngoại trừ đăng nhập, yêu cầu header:

```http
Authorization: Bearer <access_token>
```

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| POST | `/api/nhanvien/dang-nhap` | Đăng nhập |
| GET | `/api/<module>` | Lấy danh sách |
| GET | `/api/<module>/tim-kiem?keyword=...` | Tìm kiếm |
| GET | `/api/<module>/<id>` | Lấy chi tiết |
| POST | `/api/<module>` | Thêm mới |
| PUT | `/api/<module>/<id>` | Cập nhật |
| DELETE | `/api/<module>/<id>` | Xóa |
| PUT | `/api/muontra/:maMT/tra-sach` | Trả sách và xử lý vi phạm |
| GET | `/api/xulyvipham` | Danh sách vi phạm |
| PUT | `/api/xulyvipham/:maVP` | Cập nhật trạng thái thu phạt |
| GET/PUT | `/api/quydinhthuvien` | Xem/cập nhật mức phí |
| GET | `/api/thongke/dashboard` | Dữ liệu Dashboard |
| GET | `/api/nhatkyhethong` | Nhật ký hệ thống |

Các module danh mục gồm: `sach`, `tacgia`, `theloai`, `nhaxuatban`, `ngonngu`, `kesach`, `docgia`, `khoa`, `lop`, `thethuvien`, `muontra` và `nhanvien`.

## Kiểm tra trước khi commit

Frontend:

```bash
cd FE_QLTV
npm run lint
npm run build
```

Backend:

```bash
cd BE_QLTV_API
node --check src/server.js
npm run migrate:unique-contacts
```

## Triển khai

### Frontend trên Vercel

Repository đã có [vercel.json](vercel.json) để cài đặt và build `FE_QLTV`. Thiết lập biến môi trường:

```env
VITE_PUBLIC_API_URL=https://your-backend.example.com
```

### Backend

Backend cần một dịch vụ chạy Node.js và một MySQL database. Cấu hình các biến trong phần cài đặt backend, đặt `NODE_ENV=production`, dùng `AUTH_SECRET` riêng và thêm domain Vercel vào `CLIENT_URL`.

Nếu MySQL yêu cầu SSL, đặt `DB_SSL=true` và truyền CA certificate qua `DB_SSL_CA`.

## Quy ước bảo mật

- Không commit `.env`, mật khẩu database, JWT secret hoặc certificate thật.
- Không sử dụng tài khoản mẫu trong môi trường production.
- Sao lưu database trước khi chạy migration trên dữ liệu thật.
- Chỉ thêm đúng frontend origin được phép vào `CLIENT_URL`.

## Nhóm thực hiện

Nhóm 7 – 74DCHT23, Trường Đại học Công nghệ Giao thông Vận tải.
