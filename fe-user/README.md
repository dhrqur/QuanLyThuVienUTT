# Cổng thông tin độc giả UTT

Frontend React/Vite dành cho độc giả của hệ thống quản lý thư viện UTT.

## Chạy local

```bash
npm install
npm run dev
```

Ứng dụng chạy mặc định tại `http://localhost:5174` và gọi API tại `http://localhost:3000/api`.

Sao chép `.env.example` thành `.env` nếu cần đổi địa chỉ backend:

```env
VITE_LOCAL_API_URL=http://localhost:3000
VITE_PUBLIC_API_URL=https://your-api.example.com
```

Tài khoản dữ liệu mẫu: mã sinh viên `DG001`, mật khẩu tạm thời `123456`. Người dùng phải đổi mật khẩu sau lần đăng nhập đầu tiên.

## Kiểm tra

```bash
npm test
npm run lint
npm run build
```
