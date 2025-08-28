import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// wrap routes you automatically want to redirect from when already logged in
export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? <Navigate to="/todo" replace /> : <Outlet />;
}