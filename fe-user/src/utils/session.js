const STORAGE_KEY = "qltv-reader-session";

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveSession(data) {
  const session = {
    id: data.user.MaDG,
    name: data.user.TenDG,
    token: data.token,
    mustChangePassword: Boolean(data.mustChangePassword),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}
