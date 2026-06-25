import { Navigate, useLocation } from "react-router";

import { getCurrentUser, isManager } from "@/utils/auth";

function ProtectedRoute({ children, managerOnly = false }) {
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  if (managerOnly && !isManager(user)) {
    return <Navigate replace to="/muon-tra" />;
  }

  return children;
}

export default ProtectedRoute;
