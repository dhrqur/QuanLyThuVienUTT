# Capability Map: Cổng thông tin độc giả

| Module id | Trách nhiệm | Phụ thuộc |
| --- | --- | --- |
| `reader-identity` | Mật khẩu độc giả, đăng nhập JWT và phân quyền | — |
| `reader-account` | Hồ sơ cá nhân và thẻ thư viện | `reader-identity` |
| `reader-catalog` | Danh mục, tra cứu và xem chi tiết sách | `reader-identity` |
| `reader-circulation` | Yêu cầu mượn/trả, lịch sử, vi phạm và cảnh báo quá hạn | `reader-identity`, `reader-catalog` |
| `reader-portal` | Giao diện React/Vite dành cho độc giả | Bốn module trên |

Thứ tự triển khai: `reader-identity` → `reader-account`, `reader-catalog` → `reader-circulation` → `reader-portal`.

