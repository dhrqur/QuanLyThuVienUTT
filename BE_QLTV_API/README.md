# Backend quản lý thư viện UTT

API cho hệ thống quản lý thư viện UTT. Backend cung cấp dữ liệu và nghiệp vụ
cho trang quản trị thủ thư (`FE_QLTV`) và cổng độc giả (`fe-user`).

## Công nghệ

- Node.js, Express và MySQL
- JWT cho xác thực
- Swagger UI để xem tài liệu API

## Cài đặt nhanh

Yêu cầu: Node.js LTS, MySQL và một cơ sở dữ liệu tên `qltv`.

```powershell
cd BE_QLTV_API
npm install
Copy-Item .env.example .env
```

Mở `.env` và điền thông tin MySQL phù hợp. Với cơ sở dữ liệu mới, import file
`qltv.sql` bằng MySQL Workbench hoặc công cụ MySQL bạn đang dùng trước khi chạy
server.

```powershell
npm run dev
```

Server mặc định chạy tại `http://localhost:3000`. Tài liệu Swagger có tại
`http://localhost:3000/api-docs`.

## Biến môi trường

| Biến | Ý nghĩa |
| --- | --- |
| `DB_HOST`, `DB_PORT` | Máy chủ và cổng MySQL; cổng mặc định là `3306`. |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Thông tin kết nối cơ sở dữ liệu. |
| `DB_SSL`, `DB_SSL_CA` | Bật SSL và certificate khi dùng MySQL từ xa. |
| `CLIENT_URL` | Các origin frontend được phép, ngăn cách bằng dấu phẩy. |
| `AUTH_SECRET` | Chuỗi bí mật JWT; cần dài, ngẫu nhiên và không commit vào Git. |
| `PORT` | Cổng chạy API; mặc định `3000`. |

## Lệnh thường dùng

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy server với Nodemon để tự khởi động lại khi sửa code. |
| `npm start` | Chạy server thông thường. |
| `npm test` | Chạy các test Node.js. |
| `npm run migrate:unique-contacts` | Thêm ràng buộc liên hệ duy nhất. |
| `npm run migrate:finalize-schema` | Hoàn thiện schema cơ sở dữ liệu. |
| `npm run migrate:reader-auth` | Thêm dữ liệu phục vụ đăng nhập độc giả. |
| `npm run migrate:reader-requests` | Thêm bảng yêu cầu mượn/trả của độc giả. |

Chỉ chạy migration khi đã sao lưu cơ sở dữ liệu và hiểu thay đổi của migration.

## Cấu trúc thư mục

```text
src/
  config/        Kết nối MySQL, schema chạy kèm và Swagger
  routes/        Khai báo URL API
  middlewares/   Xác thực, phân quyền, validation và audit log
  controllers/   Nhận request, gọi service và trả response
  services/      Nghiệp vụ thư viện
  models/
    entities/    Câu lệnh và thao tác dữ liệu theo thực thể
    repositories/ Truy vấn dữ liệu dùng lại
  utils/         Hàm dùng chung: HTTP, ngày tháng, validation
  server.js      Điểm khởi động Express
scripts/
  migrations/    Migration chạy thủ công
test/            Test Node.js
qltv.sql         Schema và dữ liệu nền ban đầu
```

Luồng xử lý chính là: `route → middleware → controller → service → repository/entity → MySQL`.
Các route quản trị yêu cầu tài khoản nhân viên; route độc giả dùng nhóm
`docgia-auth` và `docgia-portal`.

## Chạy cùng frontend

1. Chạy backend tại cổng `3000`.
2. Chạy `FE_QLTV` cho nhân viên tại cổng `5173`.
3. Chạy `fe-user` cho độc giả tại cổng `5174`.
4. Đảm bảo `CLIENT_URL` chứa các origin frontend đang sử dụng.
