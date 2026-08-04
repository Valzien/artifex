import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

/**
 * Membungkus route yang butuh role tertentu.
 * allowedRoles: array role yang boleh akses, misal ["client"] atau ["admin"]
 *
 * Kalau belum login -> redirect ke /login
 * Kalau login tapi role tidak sesuai -> redirect ke /
 */
function ProtectedRoute({ allowedRoles, children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
