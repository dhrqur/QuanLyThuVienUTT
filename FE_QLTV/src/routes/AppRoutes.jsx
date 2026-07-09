import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";

import ProtectedRoute from "@/routes/ProtectedRoute";
import { getCurrentUser } from "@/utils/auth";
import ChiTietMuonTraView from "@/views/chitietmuontra/ChiTietMuonTraView";
import DocGiaView from "@/views/docgia/DocGiaView";
import KeSachView from "@/views/kesach/KeSachView";
import KhoaView from "@/views/khoa/KhoaView";
import LoginView from "@/views/LoginView";
import LopView from "@/views/lop/LopView";
import MuonTraView from "@/views/muontra/MuonTraView";
import NgonNguView from "@/views/ngonngu/NgonNguView";
import NhanVienView from "@/views/nhanvien/NhanVienView";
import NhaXuatBanView from "@/views/nhaxuatban/NhaXuatBanView";
import SachView from "@/views/sach/SachView";
import TacGiaView from "@/views/tacgia/TacGiaView";
import TheLoaiView from "@/views/theloai/TheLoaiView";
import TheThuVienView from "@/views/thethuvien/TheThuVienView";

const DashboardView = lazy(() => import("@/views/DashboardView"));

const protectedPage = (page) => <ProtectedRoute>{page}</ProtectedRoute>;

const dashboardPage = protectedPage(
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-bold text-slate-500">
        Đang tải Dashboard...
      </div>
    }
  >
    <DashboardView />
  </Suspense>,
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={dashboardPage} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/sach" element={protectedPage(<SachView />)} />
      <Route path="/doc-gia" element={protectedPage(<DocGiaView />)} />
      <Route path="/muon-tra" element={protectedPage(<MuonTraView />)} />
      <Route path="/chi-tiet-muon-tra" element={protectedPage(<ChiTietMuonTraView />)} />
      <Route path="/tac-gia" element={protectedPage(<TacGiaView />)} />
      <Route path="/the-loai" element={protectedPage(<TheLoaiView />)} />
      <Route path="/the-thu-vien" element={protectedPage(<TheThuVienView />)} />
      <Route path="/nhan-vien" element={protectedPage(<NhanVienView />)} />
      <Route path="/nha-xuat-ban" element={protectedPage(<NhaXuatBanView />)} />
      <Route path="/ngon-ngu" element={protectedPage(<NgonNguView />)} />
      <Route path="/ke-sach" element={protectedPage(<KeSachView />)} />
      <Route path="/khoa" element={protectedPage(<KhoaView />)} />
      <Route path="/lop" element={protectedPage(<LopView />)} />
      <Route path="*" element={<Navigate to={getCurrentUser() ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default AppRoutes;
