# Spec: reader-account

## Objective

Độc giả chỉ xem dữ liệu của mình, xem thẻ thư viện, cập nhật địa chỉ/email/số điện thoại và đổi mật khẩu.

## Tech Stack

Express/MySQL ở backend; React/Vite sử dụng hợp đồng API trong `reader-portal`.

## Commands

- Backend test: `npm.cmd test`
- Backend syntax: `node --check src/server.js`

## Project Structure

- Backend route/service/repository độc giả cá nhân nằm cạnh các module `docgia` hiện có.
- Test nằm trong `BE_QLTV_API/test/`.

## Code Style

```js
const maDG = req.user.id;
const profile = await readerAccountService.getProfile(maDG);
```

Không nhận `MaDG` từ body hoặc query cho API cá nhân.

## Testing Strategy

Kiểm thử trường cho phép, trường cấm, email/số điện thoại trùng, sai mật khẩu cũ và truy cập chéo.

## Boundaries

- Always: allowlist trường cập nhật và validate ở route boundary.
- Ask first: cho độc giả sửa tên, khoa, lớp hoặc mã sinh viên.
- Never: trả thông tin của độc giả khác hoặc trường `Pass`.

## Success Criteria

- Độc giả xem được hồ sơ và thẻ của chính mình.
- Chỉ `DiaChi`, `Email`, `Sdt` và mật khẩu có thể tự thay đổi.
- Lỗi validation/conflict dùng status code hiện có của dự án.

## Open Questions

None.

