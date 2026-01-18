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

function getDashboardPath(role) {
  const r = (role || "tourist").toString().toLowerCase();
  if (r === "admin") return "/admin";
  if (r === "local" || r === "guide") return "/local";
  return "/dashboard";
}

function normalizeUser(u = {}) {
  // Map backend shapes to the app shape
  const firstName = u.firstName || u.first_name || u.given_name || "";
  const lastName = u.lastName || u.last_name || u.family_name || "";
  const email = u.email || "";
  const phone = u.phone || u.phone_number || "";
  const role = (u.role || "tourist").toString().toLowerCase();
  const avatar =
    u.avatar ||
    u.avatarUrl ||
    u.avatar_url ||
    u.photo ||
    u.profile_picture ||
    u.profilePicture ||
    ""; // may be empty -> Avatar component will fallback
  const id = u.id || u._id || u.user_id || u.uid || "u_anon";
  const badgeStatus = (u.badgeStatus || u.badge_status || u.badge || "none")
    .toString()
    .toLowerCase();
  const isVerified = Boolean(u.isVerified ?? u.is_verified ?? false);
  return {
    id,
    firstName,
    lastName,
    email,
    phone,
    avatar,
    role,
    badgeStatus,
    isVerified,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Boot session: if a token exists, fetch profile
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
        const res = await http.get("/users/me");
        if (!cancelled) {
          setUser(normalizeUser(res.data || {}));
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
    const demo = {
      id: "u_1",
      firstName: "John",
      lastName: "Traveler",
      email: "john@example.com",
      phone: "+94 77 123 4567",
      avatar: "", // no avatar -> fallback
      role: "tourist",
    };
    setUser(demo);
    navigate("/", { replace: true });
  };

  // Optional: call after login page stores token to load profile and redirect
  const fetchProfileAndRedirect = async () => {
    try {
      const res = await http.get("/users/me");
      const normalized = normalizeUser(res.data || {});
      setUser(normalized);
      navigate("/", { replace: true });
    } catch (e) {
      // fall back to login
      navigate("/login", { replace: true });
    }
  };

  const refreshUser = async () => {
    const res = await http.get("/users/me");
    const normalized = normalizeUser(res.data || {});
    setUser(normalized);
    return normalized;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
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
      refreshUser,
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
