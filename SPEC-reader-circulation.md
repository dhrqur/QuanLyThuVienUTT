# Spec: reader-circulation

## Objective

Độc giả gửi yêu cầu mượn/trả; thủ thư duyệt hoặc từ chối. Mọi thay đổi tồn kho, trả sách và tiền phạt vẫn do backend thực hiện dưới danh tính thủ thư.

## Tech Stack

Express/MySQL transaction, React/Vite cho cả frontend quản trị và portal độc giả.

## Commands

- Backend test: `npm.cmd test`
- Migration (trong `BE_QLTV_API`): `npm.cmd run migrate:reader-requests`
- Admin lint/build: `npm.cmd run lint`, `npm.cmd run build`

## Project Structure

- Bảng `yeucaumuontra` lưu yêu cầu và quyết định xử lý.
- Bảng `chitietyeucaumuon` lưu sách/số lượng của yêu cầu mượn.
- Backend theo controller/service/repository/middleware hiện có.
- `FE_QLTV` bổ sung màn hình xử lý yêu cầu.

## Code Style

```js
await connection.beginTransaction();
// Lock request, reader/card and stock before confirming pickup.
await connection.commit();
```

## Testing Strategy

Kiểm thử tạo/hủy/duyệt/từ chối; yêu cầu trùng; thẻ hết hạn; đang có phiếu mở; thiếu tồn kho; truy cập chéo; trạng thái không hợp lệ.

## Boundaries

- Always: kiểm tra lại điều kiện mượn và tồn kho tại lúc giao sách, dùng transaction/row lock.
- Ask first: giữ chỗ tồn kho ngay khi độc giả gửi yêu cầu.
- Never: trừ kho khi mới gửi; cho độc giả tự xác nhận trả/hư hỏng/mất sách.

## Success Criteria

- Trạng thái yêu cầu: `CHO_DUYET`, `DA_DUYET`, `DA_LAY`, `TU_CHOI`, `DA_HUY`.
- `PUT /api/yeucaudocgia/:maYC/duyet-muon` nhận body `{}`: chỉ chuyển sang `DA_DUYET`, chưa tạo phiếu hay giữ/trừ kho.
- `PUT /api/yeucaudocgia/:maYC/da-lay` nhận `{ "HanTra": "YYYY-MM-DD" }`: chỉ áp dụng cho yêu cầu mượn đã duyệt. Ngày mượn là ngày xác nhận; hạn trả phải sau ngày này.
- Xác nhận lấy sách tạo phiếu, gắn thủ thư giao sách, trừ kho và chuyển sang `DA_LAY` nguyên tử. Lỗi giữ nguyên dữ liệu; xác nhận lặp bị từ chối.
- Yêu cầu cũ đã duyệt và có `MaMT` chỉ chuyển trạng thái khi xác nhận; giữ phiếu, ngày mượn, hạn trả và tồn kho hiện có.
- Yêu cầu chờ duyệt hoặc chờ lấy sách đều ngăn độc giả gửi thêm yêu cầu mượn.
- Migration bổ sung giá trị enum `DA_LAY` cho database cũ; backend cũng kiểm tra schema khi khởi động.
- Duyệt trả tái sử dụng quy tắc hoàn kho/vi phạm hiện có.
- Độc giả thấy lý do từ chối, lịch sử, tiền phạt và cảnh báo còn tối đa 3 ngày hoặc quá hạn.

## Open Questions

None.

