import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { consumeRedirectPath } = useAuth();

  useEffect(() => {
    const token = params.get("jwt") || params.get("access_token");
    const rawUser = params.get("user");

    const finish = (jwt, user) => {
      localStorage.setItem("auth_jwt", jwt);
      localStorage.setItem("auth_user", JSON.stringify(user));
      navigate(consumeRedirectPath() || "/", { replace: true });
    };

    const fetchUser = async (jwt) => {
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return res.data;
    };

    (async () => {
      try {
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          finish(token, parsed);
          return;
        }

        const me = await fetchUser(token);
        finish(token, me);
      } catch (err) {
        navigate("/login", { replace: true });
      }
    })();
  }, [params, navigate, consumeRedirectPath]);

  return null;
}
