import axios from "axios";

const LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:3000";
const PUBLIC_API_URL =
  import.meta.env.VITE_PUBLIC_API_URL ||
  "https://quanlythuvienutt.onrender.com";
const isLocalFrontend =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);
const apiOrigin =
  import.meta.env.VITE_API_URL ||
  (isLocalFrontend ? LOCAL_API_URL : PUBLIC_API_URL);
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `${apiOrigin.replace(/\/+$/, "")}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  try {
    const session = JSON.parse(localStorage.getItem("library-current-user") || "null");
    if (session?.token) config.headers.Authorization = `Bearer ${session.token}`;
  } catch {
    localStorage.removeItem("library-current-user");
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("library-current-user");
      if (window.location.pathname !== "/login") window.location.assign("/login");
    }
    return Promise.reject(error);
  },
);

function normalizeDates(value) {
  if (Array.isArray(value)) return value.map(normalizeDates);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeDates(item)]),
    );
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return value.slice(0, 10);
  }

  return value;
}

function unwrap(response) {
  return normalizeDates(response.data);
}

export function getApiErrorMessage(error, fallback = "Không thể kết nối đến máy chủ.") {
  return error?.response?.data?.message || error?.message || fallback;
}

function buildResourcePath(module, id) {
  const ids = Array.isArray(id) ? id : [id];

  const suffix = ids
    .filter((value) => value !== undefined && value !== null && value !== "")
    .map((value) => encodeURIComponent(value))
    .join("/");

  return suffix ? `/${module}/${suffix}` : `/${module}`;
}

export const api = {
  async request(method, path, data, config = {}) {
    return unwrap(await apiClient.request({ method, url: path, data, ...config }));
  },
  async getAll(module) {
    return unwrap(await apiClient.get(`/${module}`));
  },

  async search(module, keyword) {
    return unwrap(await apiClient.get(`/${module}/tim-kiem`, { params: { keyword } }));
  },

  async create(module, data) {
    return unwrap(await apiClient.post(`/${module}`, data));
  },

  async update(module, id, data) {
    return unwrap(await apiClient.put(buildResourcePath(module, id), data));
  },

  async remove(module, id) {
    return unwrap(await apiClient.delete(buildResourcePath(module, id)));
  },

  async login(User, Pass) {
    return unwrap(await apiClient.post("/nhanvien/dang-nhap", { User, Pass }));
  },

  async logout() {
    return unwrap(await apiClient.post("/nhanvien/dang-xuat"));
  },

  async getStatistics(module) {
    return unwrap(await apiClient.get(`/${module}/thong-ke`));
  },

  async getOverviewStatistics() {
    return unwrap(await apiClient.get("/thongke/tong-quan"));
  },

  async returnBooks(maMT, NgayTra) {
    return unwrap(
      await apiClient.put(`/muontra/${encodeURIComponent(maMT)}/tra-sach`, {
        NgayTra,
      }),
    );
  },
};
