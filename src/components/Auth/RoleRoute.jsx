import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function RoleRoute({ allowedRoles }) {
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!allowedRoles.includes(role)) {
    return <Navigate to={location.state?.from || "/dashboard"} replace />;
  }

  return <Outlet />;
}
