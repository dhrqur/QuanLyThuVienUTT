# Reader Portal Tasks

## Phase 1 — Đặc tả và baseline

- [x] Ghi capability map và năm module spec.
- [x] Ghi implementation plan và checklist.
- [x] Hoàn tất baseline lint/build sau khi cài dependency frontend.

## Phase 2 — Reader identity

- [x] Thêm test RED cho mật khẩu, token và dữ liệu an toàn.
- [x] Thêm migration/seed cho `docgia.Pass`.
- [x] Thêm API đăng nhập/đổi mật khẩu và phân quyền.
- [x] Chạy backend tests.
- [ ] Kiểm tra migration trên MySQL đang hoạt động.

## Phase 3 — Reader self-service

- [x] Thêm API hồ sơ và thẻ thư viện.
- [x] Thêm API catalog có tìm kiếm/phân trang.
- [x] Thêm API mượn trả, vi phạm và cảnh báo cá nhân.
- [x] Kiểm thử quyền sở hữu và validation.

## Phase 4 — Request workflow

- [x] Thêm schema yêu cầu mượn/trả và migration.
- [x] Thêm API tạo/hủy/xem yêu cầu của độc giả.
- [x] Thêm API duyệt/từ chối dành cho thủ thư.
- [x] Kiểm thử unit cho transaction và chuyển trạng thái.
- [ ] Kiểm thử tích hợp tồn kho, thẻ và trạng thái trên MySQL.

## Phase 5 — Staff request UI

- [x] Thêm API client, route, sidebar và màn hình xử lý yêu cầu.
- [x] Kiểm tra lint/build và các trạng thái UI.

## Phase 6 — Reader portal UI

- [x] Scaffold `fe-user` theo stack hiện tại.
- [x] Xây auth/layout/dashboard/profile.
- [x] Xây catalog và giỏ yêu cầu mượn.
- [x] Xây yêu cầu, lịch sử, cảnh báo và vi phạm.
- [x] Kiểm tra test/lint/build.
- [ ] Kiểm tra responsive bằng trình duyệt tự động.

## Phase 7 — Final verification

- [ ] Xác minh migration trên database tạm nếu khả dụng.
- [x] Chạy toàn bộ test/lint/build.
- [x] Kiểm tra final diff.
- [ ] Kiểm tra runtime trình duyệt.
- [x] Cập nhật README và loại bỏ artifact tạm.
