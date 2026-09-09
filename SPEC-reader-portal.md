# Spec: reader-portal

## Objective

Tạo ứng dụng `fe-user` responsive cho độc giả: đăng nhập, đổi mật khẩu lần đầu, tổng quan, catalog, yêu cầu, mượn trả, vi phạm và hồ sơ.

## Tech Stack

React 19, Vite 8, React Router, Axios, Tailwind CSS 4, Lucide React và Sonner theo frontend hiện có.

## Commands

- Cài đặt: `npm.cmd ci`
- Chạy local: `npm.cmd run dev` (cổng 5174)
- Lint: `npm.cmd run lint`
- Build: `npm.cmd run build`

## Project Structure

- `fe-user/src/components/`: layout và UI dùng chung.
- `fe-user/src/views/`: màn hình theo nghiệp vụ.
- `fe-user/src/lib/`: API client.
- `fe-user/src/utils/`: session và định dạng.

## Code Style

```jsx
function ReaderDashboard() {
  return <ReaderLayout>{/* trạng thái cá nhân */}</ReaderLayout>;
}
```

Component rõ trách nhiệm, trạng thái loading/error/empty tường minh và không dựng abstraction form/table quản trị không cần thiết.

## Testing Strategy

Lint/build, kiểm thử logic thuần và xác minh runtime các luồng chính trên trình duyệt ở desktop/mobile.

## Boundaries

- Always: keyboard accessible, label rõ, responsive, xử lý 401 nhất quán.
- Ask first: thêm thư viện ngoài stack hiện có hoặc thay đổi nhận diện thương hiệu.
- Never: hiển thị chức năng quản trị hoặc tin dữ liệu định danh do client gửi.

## Success Criteria

- Có đầy đủ các màn hình đã duyệt và điều hướng được bảo vệ.
- Độc giả hoàn thành được luồng yêu cầu mượn/trả từ mobile và desktop.
- Cảnh báo quá hạn dễ nhận biết; lỗi mạng và dữ liệu rỗng có thông báo rõ.

## Open Questions

None.

