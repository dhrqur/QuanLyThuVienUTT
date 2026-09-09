# Trang quản trị thư viện UTT

Frontend dành cho nhân viên và quản lý thư viện. Ứng dụng hỗ trợ quản lý sách,
độc giả, mượn/trả, yêu cầu độc giả, vi phạm, danh mục và thống kê.

## Công nghệ

- React, Vite và React Router
- Tailwind CSS
- Axios để gọi backend
- Recharts và ExcelJS cho báo cáo/xuất dữ liệu

## Cài đặt và chạy

Chạy backend `BE_QLTV_API` trước, sau đó:

```powershell
cd FE_QLTV
npm install
Copy-Item .env.example .env
npm run dev
```

Vite mặc định chạy tại `http://localhost:5173`.

## Cấu hình môi trường

| Biến | Ý nghĩa |
| --- | --- |
| `VITE_LOCAL_API_URL` | URL API dùng khi mở trang ở máy cục bộ, thường là `http://localhost:3000`. |
| `VITE_PUBLIC_API_URL` | URL API dùng khi ứng dụng được triển khai công khai. |
| `VITE_API_URL` | Tùy chọn: ghi đè URL API đã chọn ở trên. |
| `VITE_API_BASE_URL` | Tùy chọn: ghi đè toàn bộ URL API, gồm cả `/api`. |

Không đưa token, mật khẩu hoặc thông tin bí mật vào file `.env` đã commit.

## Lệnh thường dùng

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy môi trường phát triển. |
| `npm run build` | Tạo bản build production vào `dist/`. |
| `npm run preview` | Mở thử bản build local. |
| `npm run lint` | Kiểm tra quy tắc ESLint. |

## Cấu trúc thư mục

```text
src/
  components/
    common/      Bảng dữ liệu, dialog, input và thành phần dùng chung
    layout/      Sidebar, header và khung trang quản trị
    ui/          Thành phần giao diện cơ bản
  hooks/         Hook lấy danh sách và điều khiển bảng dữ liệu
  lib/           Axios client và hàm tiện ích dùng chung
  routes/        Route và bảo vệ trang đăng nhập
  utils/         Session, phân quyền, validation, Excel/PDF và định dạng dữ liệu
  views/         Mỗi chức năng nghiệp vụ tương ứng một màn hình
  App.jsx        Điểm ghép giao diện
  main.jsx       Điểm khởi động React
```

Quy trình chính: `view → hook/lib API → BE_QLTV_API`. Route bảo vệ kiểm tra
session; quyền của người dùng quyết định màn hình và thao tác được hiển thị.

## Các nhóm màn hình

- Tổng quan và thống kê
- Sách, tác giả, thể loại, nhà xuất bản, ngôn ngữ, kệ sách
- Độc giả, khoa, lớp, thẻ thư viện và nhân viên
- Mượn/trả, yêu cầu độc giả, xử lý vi phạm, quy định và nhật ký hệ thống
