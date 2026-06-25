import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://quanlythuvienutt-production.up.railway.app";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

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
