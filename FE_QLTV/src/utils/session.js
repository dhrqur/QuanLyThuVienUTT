import { api } from "@/lib/api";

const SESSION_STORAGE_KEY = "library-current-user";

export function getCurrentUser() {
  try {
    const chuoiNguoiDung = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!chuoiNguoiDung) {
      return null;
    }

    return JSON.parse(chuoiNguoiDung);
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export async function login(username, password) {
  const ketQuaDangNhap = await api.login(username.trim(), password);
  const taiKhoan = ketQuaDangNhap.data?.user ?? ketQuaDangNhap.data;

  const nguoiDungHienTai = {
    id: taiKhoan.MaNV,
    username: taiKhoan.User,
    name: taiKhoan.TenNV,
    role: taiKhoan.VaiTro,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nguoiDungHienTai));
  return nguoiDungHienTai;
}

export function logout() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
