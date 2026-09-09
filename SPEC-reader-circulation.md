# Spec: reader-circulation

## Objective

Độc giả gửi yêu cầu mượn/trả; thủ thư duyệt hoặc từ chối. Mọi thay đổi tồn kho, trả sách và tiền phạt vẫn do backend thực hiện dưới danh tính thủ thư.

## Tech Stack

Express/MySQL transaction, React/Vite cho cả frontend quản trị và portal độc giả.

## Commands

- Backend test: `npm.cmd test`
- Migration: `npm.cmd run migrate:reader-portal`
- Admin lint/build: `npm.cmd run lint`, `npm.cmd run build`

## Project Structure

- Bảng `yeucaumuontra` lưu yêu cầu và quyết định xử lý.
- Bảng `chitietyeucaumuon` lưu sách/số lượng của yêu cầu mượn.
- Backend theo controller/service/repository/middleware hiện có.
- `FE_QLTV` bổ sung màn hình xử lý yêu cầu.

## Code Style

```js
await connection.beginTransaction();
// Lock request, reader/card and stock before approving a borrow request.
await connection.commit();
```

## Testing Strategy

Kiểm thử tạo/hủy/duyệt/từ chối; yêu cầu trùng; thẻ hết hạn; đang có phiếu mở; thiếu tồn kho; truy cập chéo; trạng thái không hợp lệ.

## Boundaries

- Always: kiểm tra lại điều kiện tại lúc duyệt và dùng transaction/row lock.
- Ask first: giữ chỗ tồn kho ngay khi độc giả gửi yêu cầu.
- Never: trừ kho khi mới gửi; cho độc giả tự xác nhận trả/hư hỏng/mất sách.

## Success Criteria

- Trạng thái yêu cầu: `CHO_DUYET`, `DA_DUYET`, `TU_CHOI`, `DA_HUY`.
- Duyệt mượn sinh phiếu mượn, gắn thủ thư xử lý và trừ kho nguyên tử.
- Duyệt trả tái sử dụng quy tắc hoàn kho/vi phạm hiện có.
- Độc giả thấy lý do từ chối, lịch sử, tiền phạt và cảnh báo còn tối đa 3 ngày hoặc quá hạn.

## Open Questions

None.

