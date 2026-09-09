import { Navigate, Outlet, useLocation } from "react-router";

import { getSession } from "@/utils/session";

export default function ProtectedRoute({ allowPasswordChange = false }) {
  const session = getSession();
  const location = useLocation();
  if (!session?.token) return <Navigate replace state={{ from: location.pathname }} to="/dang-nhap" />;
  if (session.mustChangePassword && !allowPasswordChange) return <Navigate replace to="/doi-mat-khau" />;
  if (!session.mustChangePassword && allowPasswordChange) return <Navigate replace to="/" />;
  return <Outlet />;
}
