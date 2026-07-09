import { api } from "@/lib/api";

const SESSION_STORAGE_KEY = "library-current-user";

export function getCurrentUser() {
  try {
    const storedUser = localStorage.getItem(SESSION_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export async function login(username, password) {
  const response = await api.login(username.trim(), password);
  const account = response.data?.user ?? response.data;
  const user = {
    id: account.MaNV,
    username: account.User,
    name: account.TenNV,
    role: account.VaiTro,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
