import axios from "axios";

import { clearSession, getSession } from "@/utils/session";

const localOrigin = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:3000";
const publicOrigin = import.meta.env.VITE_PUBLIC_API_URL || "https://quanlythuvienutt.onrender.com";
const isLocalBrowser = typeof window !== "undefined"
  && ["localhost", "127.0.0.1"].includes(window.location.hostname);
const apiOrigin = import.meta.env.VITE_API_URL || (isLocalBrowser ? localOrigin : publicOrigin);

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || `${apiOrigin.replace(/\/+$/, "")}/api`,
  headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = getSession()?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      if (window.location.pathname !== "/dang-nhap") window.location.assign("/dang-nhap");
    }
    if (error.response?.data?.code === "PASSWORD_CHANGE_REQUIRED") {
      window.location.assign("/doi-mat-khau");
    }
    return Promise.reject(error);
  },
);

function getResponseData(response) {
  return response.data?.data;
}

export function errorMessage(error, fallback = "Không thể kết nối máy chủ. Vui lòng thử lại.") {
  return error.response?.data?.message || (error.code === "ECONNABORTED" ? "Máy chủ phản hồi quá lâu." : fallback);
}

export const readerApi = {
  async login(MaDG, Pass) {
    return getResponseData(await client.post("/docgia-auth/dang-nhap", { MaDG, Pass }));
  },
  async changePassword(payload) {
    return getResponseData(await client.put("/docgia-auth/doi-mat-khau", payload));
  },
  async dashboard() {
    return getResponseData(await client.get("/docgia-portal/tong-quan"));
  },
  async profile() {
    return getResponseData(await client.get("/docgia-portal/tai-khoan"));
  },
  async updateProfile(payload) {
    return getResponseData(await client.patch("/docgia-portal/tai-khoan", payload));
  },
  async catalog(params) {
    return getResponseData(await client.get("/docgia-portal/sach", { params }));
  },
  async loans() {
    return getResponseData(await client.get("/docgia-portal/muon-tra"));
  },
  async violations() {
    return getResponseData(await client.get("/docgia-portal/vi-pham"));
  },
  async requests(params = {}) {
    return getResponseData(await client.get("/docgia-portal/yeu-cau", { params }));
  },
  async createRequest(payload) {
    return getResponseData(await client.post("/docgia-portal/yeu-cau", payload));
  },
  async cancelRequest(maYC) {
    return getResponseData(await client.delete(`/docgia-portal/yeu-cau/${encodeURIComponent(maYC)}`));
  },
};
