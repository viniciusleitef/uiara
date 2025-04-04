import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AuthGuard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.type) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user?.type) {
    return null;
  }

  return <Outlet />;
}
