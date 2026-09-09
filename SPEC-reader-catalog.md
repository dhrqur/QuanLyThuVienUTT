# Spec: reader-catalog

## Objective

Độc giả xem, tra cứu và phân trang danh mục sách mà không có quyền sửa dữ liệu kho.

## Tech Stack

Express/MySQL và React/Vite; tái sử dụng dữ liệu sách, tác giả, thể loại, ngôn ngữ và vị trí hiện có.

## Commands

- Backend test: `npm.cmd test`
- Frontend lint: `npm.cmd run lint`
- Frontend build: `npm.cmd run build`

## Project Structure

- API đọc dành cho portal ở backend.
- Màn hình danh mục trong `fe-user/src/views/`.

## Code Style

```js
const page = Math.max(Number(req.query.page) || 1, 1);
const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 12, 1), 50);
```

## Testing Strategy

Kiểm thử tìm kiếm rỗng/có kết quả/không kết quả, phân trang và giới hạn kích thước trang; xác minh UI loading/error/empty.

## Boundaries

- Always: query tham số hóa và phân trang có giới hạn.
- Ask first: mở catalog cho người chưa đăng nhập.
- Never: cấp endpoint ghi sách cho vai trò độc giả.

## Success Criteria

- Độc giả xem được thông tin mô tả đang có và số lượng khả dụng.
- Tìm kiếm theo mã, tên, tác giả, thể loại, nhà xuất bản, ngôn ngữ và vị trí.
- Không thay đổi API quản trị sách hiện tại.

## Open Questions

None.

