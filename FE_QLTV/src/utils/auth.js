import { api } from "@/lib/api";

const AUTH_STORAGE_KEY = "library-current-user";

export function getCurrentUser() {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    const user = storedUser ? JSON.parse(storedUser) : null;
    return user?.token ? user : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export async function login(username, password) {
  const response = await api.login(username.trim(), password);
  const payload = response.data;
  const account = payload.user ?? payload;
  const user = {
    id: account.MaNV,
    username: account.User,
    name: account.TenNV,
    role: account.VaiTro,
    token: payload.token ?? "",
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isManager(user = getCurrentUser()) {
  const role = normalizeRole(user?.role);
  return role === "quan ly" || role === "quan ly thu vien" || role === "admin";
}

function normalizeRole(role) {
  return String(role ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .trim()
    .toLowerCase();
}
