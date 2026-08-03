import { Navigate, Outlet, useLocation } from "react-router";

import { getCurrentUser } from "@/utils/session";
import { canAccessPath, getDefaultRoute } from "@/utils/accessControl";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  if (!canAccessPath(user, location.pathname)) {
    return <Navigate replace to={getDefaultRoute(user)} />;
  }

  return children ?? <Outlet />;
}

export default ProtectedRoute;
