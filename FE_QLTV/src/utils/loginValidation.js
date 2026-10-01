export function validateLoginCredentials(username, password) {
  if (!username.trim()) {
    return { username: "Vui lòng nhập tên đăng nhập." };
  }

  if (!password.trim()) {
    return { password: "Vui lòng nhập mật khẩu." };
  }

  return {};
}
