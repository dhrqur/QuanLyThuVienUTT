import { Navigate, Route, Routes } from "react-router";

import ProtectedRoute from "@/routes/ProtectedRoute";
import { getCurrentUser } from "@/utils/session";
import ChiTietMuonTraView from "@/views/chitietmuontra/ChiTietMuonTraView";
import DashboardView from "@/views/DashboardView";
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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardView />} />
        <Route path="/sach" element={<SachView />} />
        <Route path="/doc-gia" element={<DocGiaView />} />
        <Route path="/muon-tra" element={<MuonTraView />} />
        <Route path="/chi-tiet-muon-tra" element={<ChiTietMuonTraView />} />
        <Route path="/tac-gia" element={<TacGiaView />} />
        <Route path="/the-loai" element={<TheLoaiView />} />
        <Route path="/the-thu-vien" element={<TheThuVienView />} />
        <Route path="/nhan-vien" element={<NhanVienView />} />
        <Route path="/nha-xuat-ban" element={<NhaXuatBanView />} />
        <Route path="/ngon-ngu" element={<NgonNguView />} />
        <Route path="/ke-sach" element={<KeSachView />} />
        <Route path="/khoa" element={<KhoaView />} />
        <Route path="/lop" element={<LopView />} />
      </Route>

      <Route path="*" element={<Navigate to={getCurrentUser() ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default AppRoutes;
