import { api } from "@/lib/api";

const AUTH_STORAGE_KEY = "library-current-user";

export function getCurrentUser() {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export async function login(username, password) {
  const response = await api.login(username.trim(), password);
  const account = response.data;
  const user = {
    id: account.MaNV,
    username: account.User,
    name: account.TenNV,
    role: account.VaiTro,
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

export function isLibrarian(user = getCurrentUser()) {
  return normalizeRole(user?.role) === "thu thu";
}

function normalizeRole(role) {
  return String(role ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .trim()
    .toLowerCase();
}
