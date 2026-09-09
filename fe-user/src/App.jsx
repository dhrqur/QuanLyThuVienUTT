import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";

import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import CatalogPage from "@/views/CatalogPage";
import ChangePasswordPage from "@/views/ChangePasswordPage";
import DashboardPage from "@/views/DashboardPage";
import LoansPage from "@/views/LoansPage";
import LoginPage from "@/views/LoginPage";
import ProfilePage from "@/views/ProfilePage";
import RequestsPage from "@/views/RequestsPage";

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route element={<ProtectedRoute allowPasswordChange />}>
          <Route path="/doi-mat-khau" element={<ChangePasswordPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tra-cuu" element={<CatalogPage />} />
          <Route path="/yeu-cau" element={<RequestsPage />} />
          <Route path="/muon-tra" element={<LoansPage />} />
          <Route path="/tai-khoan" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      <Toaster closeButton position="top-right" richColors />
    </CartProvider>
  );
}
