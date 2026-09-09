# Spec: reader-identity

## Objective

Độc giả đăng nhập bằng mã sinh viên `MaDG` và mật khẩu. Bảng `docgia` chỉ thêm `Pass`; không thêm cột tên đăng nhập. Mật khẩu luôn là bcrypt hash và không xuất hiện trong phản hồi API.

## Tech Stack

Node.js, Express, MySQL, `bcrypt`, `jsonwebtoken`; giữ nguyên kiến trúc controller → service → repository.

## Commands

- Kiểm tra backend: `npm.cmd test`
- Kiểm tra cú pháp: `node --check src/server.js`
- Chạy local: `npm.cmd run dev`
- Migration: `npm.cmd run migrate:reader-portal`

## Project Structure

- `BE_QLTV_API/src/`: mã nguồn API.
- `BE_QLTV_API/scripts/migrations/`: migration idempotent.
- `BE_QLTV_API/test/`: kiểm thử bằng `node:test`.

## Code Style

```js
async function loginReader(maDG, password) {
    const reader = await repository.getByIdWithPassword(maDG);
    // Verify and return a password-free account object.
}
```

Dùng tên theo nghiệp vụ hiện có, query tham số hóa và lỗi HTTP rõ ràng.

## Testing Strategy

Kiểm thử mật khẩu đúng/sai, token độc giả, mật khẩu mặc định, đổi mật khẩu và việc không rò rỉ `Pass`.

## Boundaries

- Always: bcrypt 12 rounds, lấy danh tính từ JWT, giữ tương thích token nhân viên.
- Ask first: thay đổi loại token hoặc thêm phương thức đăng nhập khác.
- Never: lưu/trả/log mật khẩu thô; cho token độc giả qua middleware dành cho nhân viên.

## Success Criteria

- Migration bảo toàn độc giả hiện có và khởi tạo mật khẩu tạm `123456` dưới dạng hash.
- Độc giả đăng nhập bằng `MaDG`; tài khoản mặc định phải đổi mật khẩu trước khi dùng portal.
- Endpoint nhân viên cũ vẫn hoạt động như trước.

## Open Questions

None.

