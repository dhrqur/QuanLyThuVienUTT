const STORAGE_KEY = "qltv-reader-session";

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveSession(loginResponse) {
  const session = {
    id: loginResponse.user.MaDG,
    name: loginResponse.user.TenDG,
    token: loginResponse.token,
    mustChangePassword: Boolean(loginResponse.mustChangePassword),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}
