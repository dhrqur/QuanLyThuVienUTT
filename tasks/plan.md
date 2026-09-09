# Implementation Plan: Cổng thông tin độc giả

## Overview

Mở rộng hệ thống hiện có bằng xác thực độc giả qua `MaDG`, API self-service có phân quyền, quy trình yêu cầu mượn/trả được thủ thư duyệt và một frontend React/Vite riêng tại `fe-user`.

## Architecture Decisions

- `MaDG` là tên đăng nhập; `docgia` chỉ thêm cột bcrypt hash `Pass`.
- API portal lấy độc giả từ JWT, không tin `MaDG` do client gửi.
- Yêu cầu không giữ chỗ hoặc thay đổi tồn kho; duyệt mượn mới tạo `muontra` trong transaction.
- Trả sách luôn qua thủ thư để đánh giá hư hỏng/mất và xác lập tiền phạt.
- Giữ nguyên hợp đồng API nhân viên hiện tại; route độc giả được tách riêng.

## Task List

### Phase 1: Đặc tả và baseline

- Ghi capability map, module spec, plan và checklist.
- Chạy kiểm tra cú pháp backend, lint/build frontend hiện tại.

### Phase 2: Reader identity

- Thêm migration/seed `docgia.Pass`.
- Thêm đăng nhập, đổi mật khẩu mặc định và authorization độc giả.
- Thêm kiểm thử tập trung.

### Phase 3: Reader self-service

- Thêm API hồ sơ/thẻ.
- Thêm API catalog.
- Thêm API lịch sử/vi phạm/cảnh báo.

### Phase 4: Request workflow

- Thêm schema và API yêu cầu mượn/trả.
- Thêm xử lý duyệt/từ chối phía thủ thư.
- Xác minh transaction, tồn kho và quyền sở hữu.

### Phase 5: Staff request UI

- Thêm màn hình xử lý yêu cầu vào `FE_QLTV`.
- Xác minh lint/build và luồng xử lý.

### Phase 6: Reader portal UI

- Scaffold `fe-user` và xây các màn hình đã đặc tả.
- Xác minh responsive, accessibility, trạng thái lỗi/rỗng/tải.

### Phase 7: Final verification

- Chạy toàn bộ test/lint/build, kiểm tra runtime, migration và final diff.
- Cập nhật README và loại bỏ artifact tạm.

## Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Duyệt đồng thời vượt tồn kho | High | Transaction, `FOR UPDATE`, kiểm tra lại khi duyệt |
| Độc giả truy cập dữ liệu người khác | High | Luôn lấy `MaDG` từ JWT và test truy cập chéo |
| Mật khẩu tạm dễ đoán | High | Bcrypt và bắt buộc đổi trước khi dùng portal |
| Migration trên dữ liệu hiện có | Medium | Script idempotent, kiểm tra trước/sau và không xóa dữ liệu |
| API nhân viên bị ảnh hưởng | Medium | Route additive và test hành vi cũ |

## Open Questions

None.

