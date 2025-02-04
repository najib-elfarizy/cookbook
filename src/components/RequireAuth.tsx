import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate(`/auth?redirectTo=${encodeURIComponent(location.pathname)}`, {
        replace: true,
      });
    }
  }, [user, navigate, location]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAuth;
