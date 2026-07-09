import { Navigate, Outlet, useLocation } from "react-router";

import { getCurrentUser } from "@/utils/session";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  return children ?? <Outlet />;
}

export default ProtectedRoute;
