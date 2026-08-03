const LIBRARIAN_ONLY_RESTRICTED_PATHS = new Set(["/", "/nhan-vien"]);

function normalizeRole(role) {
  return String(role || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi-VN")
    .trim();
}

export function isLibrarian(user) {
  return normalizeRole(user?.role) === "thu thu";
}

export function getDefaultRoute(user) {
  return isLibrarian(user) ? "/muon-tra" : "/";
}

export function canAccessPath(user, path) {
  return !isLibrarian(user) || !LIBRARIAN_ONLY_RESTRICTED_PATHS.has(path);
}
