# Cổng thông tin độc giả UTT

Frontend dành cho sinh viên/độc giả. Người dùng có thể tra cứu sách, gửi yêu
cầu mượn hoặc trả, theo dõi phiếu mượn/vi phạm và cập nhật tài khoản.

## Công nghệ

- React, Vite và React Router
- Tailwind CSS
- Axios để gọi backend
- Sonner để hiển thị thông báo

## Cài đặt và chạy

Chạy backend `BE_QLTV_API` trước, sau đó:

```powershell
cd fe-user
npm install
Copy-Item .env.example .env
npm run dev
```

Ứng dụng phát triển mặc định chạy tại `http://localhost:5174`.

## Cấu hình môi trường

| Biến | Ý nghĩa |
| --- | --- |
| `VITE_LOCAL_API_URL` | URL API cho môi trường local, thường là `http://localhost:3000`. |
| `VITE_PUBLIC_API_URL` | URL API khi chạy trên môi trường công khai. |
| `VITE_API_URL` | Tùy chọn: ghi đè URL API đã chọn. |
| `VITE_API_BASE_URL` | Tùy chọn: ghi đè toàn bộ URL API, gồm cả `/api`. |

## Lệnh thường dùng

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy môi trường phát triển tại cổng `5174`. |
| `npm run build` | Tạo bản build production. |
| `npm run preview` | Mở thử bản build tại cổng `4174`. |
| `npm run lint` | Kiểm tra ESLint. |
| `npm test` | Chạy test trạng thái phiếu mượn. |

## Cấu trúc thư mục

```text
src/
  components/
    common/      Trạng thái tải/lỗi và nhãn trạng thái
    layout/      Khung trang và điều hướng độc giả
  contexts/      State giỏ yêu cầu mượn sách
  lib/           Axios client và các hàm gọi API
  routes/        Bảo vệ route theo phiên đăng nhập
  utils/         Session, định dạng dữ liệu và trạng thái mượn
  views/         Các trang đăng nhập, tra cứu, mượn/trả, yêu cầu, hồ sơ
  App.jsx        Khai báo route ứng dụng
  main.jsx       Điểm khởi động React
test/            Test Node.js cho nghiệp vụ trạng thái mượn
```

## Các trang chính

| Đường dẫn | Chức năng |
| --- | --- |
| `/dang-nhap` | Đăng nhập độc giả. |
| `/doi-mat-khau` | Đổi mật khẩu bắt buộc khi cần. |
| `/` | Tổng quan tài khoản và phiếu mượn. |
| `/tra-cuu` | Tra cứu sách và giỏ yêu cầu mượn. |
| `/yeu-cau` | Theo dõi hoặc hủy yêu cầu. |
| `/muon-tra` | Xem mượn/trả, yêu cầu trả và vi phạm. |
| `/tai-khoan` | Cập nhật liên hệ và đổi mật khẩu. |

Luồng chính: `view → readerApi → BE_QLTV_API`. Session và token được lưu ở
local storage; backend vẫn là nơi xác thực và phân quyền cuối cùng.
