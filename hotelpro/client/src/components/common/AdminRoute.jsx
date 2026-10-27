import { Navigate } from "react-router-dom";
import { isLoggedIn, getUser } from "../../utils/auth.js";

export default function AdminRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  if (getUser()?.userType !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
