import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import http from "../lib/http";

const AuthContext = createContext(null);

function normalizeUser(u = {}) {
  // Map backend shapes to the app shape
  const firstName = u.firstName || u.first_name || u.given_name || "";
  const lastName = u.lastName || u.last_name || u.family_name || "";
  const email = u.email || "";
  const phone = u.phone || u.phone_number || "";
  const roleRaw = u.role || u.userRole || u.type || u.user_type || "tourist";
  const role = typeof roleRaw === "string" ? roleRaw.toLowerCase() : "tourist";
  const avatar = u.avatar || u.avatarUrl || u.avatar_url || u.photo || ""; // may be empty -> Avatar component will fallback
  const id = u.id || u._id || u.user_id || u.uid || "u_anon";
  return { id, firstName, lastName, email, phone, avatar, role };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Boot session: if a token exists, hydrate from localStorage (no /users/me route on server)
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("access_token") ||
          sessionStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }
        // Prefer localStorage user to avoid relying on a non-existent /users/me endpoint
        const raw = localStorage.getItem("user");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (!cancelled) setUser(normalizeUser(parsed));
        } else {
          // Optional best-effort fetch if your API supports /users/:id
          // Disabled by default to avoid 404s; uncomment and adapt if available.
          // const id = JSON.parse(raw)?.id;
          // if (id) {
          //   const res = await http.get(`/users/${id}`);
          //   if (!cancelled) setUser(normalizeUser(res.data || {}));
          // }
        }
      } catch (e) {
        // Token invalid -> clear
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  // Demo login (kept for quick testing)
  const loginAsDemo = () => {
    setUser({
      id: "u_1",
      firstName: "John",
      lastName: "Traveler",
      email: "john@example.com",
      phone: "+94 77 123 4567",
      avatar: "", // no avatar -> fallback
    });
    const next = new URLSearchParams(location.search).get("next");
    navigate(next || "/dashboard", { replace: true });
  };

  // Optional: after login, hydrate from storage and redirect
  const fetchProfileAndRedirect = async () => {
    let n = null;
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        n = normalizeUser(JSON.parse(raw));
        setUser(n);
      }
    } finally {
      const next = new URLSearchParams(location.search).get("next");
      if (next) {
        navigate(next, { replace: true });
      } else {
        const src = n || user;
        const dest =
          src && (src.role === "local" || src.role === "guide")
            ? "/local"
            : "/dashboard";
        navigate(dest, { replace: true });
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      initializing,
      loginAsDemo,
      logout,
      fetchProfileAndRedirect,
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
