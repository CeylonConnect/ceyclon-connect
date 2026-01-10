import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FloatingInput from "../components/FloatingInput";
import http from "../lib/http"; // axios instance
import { toast } from "react-toastify";
import { useAuth } from "../state/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "";
  const { user: authUser, setUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // If user already logged in, bounce away from /login
  useEffect(() => {
    if (authUser) {
      // Always go Home after login/signup per requirement.
      navigate("/", { replace: true });
    }
  }, [authUser, next, navigate]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  function validate() {
    const nextErr = {};
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      nextErr.email = "Valid email required";
    if (form.password.length < 6) nextErr.password = "Min 6 characters";
    return nextErr;
  }

  function normalizeUser(u = {}) {
    return {
      id: u.id || u._id || u.user_id || "u_me",
      firstName: u.firstName || u.first_name || "",
      lastName: u.lastName || u.last_name || "",
      email: u.email || "",
      phone: u.phone || u.phone_number || "",
      avatar: u.avatar || u.avatarUrl || u.avatar_url || u.photo || "",
      role: u.role || "tourist",
      badgeStatus: (u.badgeStatus || u.badge_status || "none")
        .toString()
        .toLowerCase(),
      createdAt: u.createdAt,
    };
  }

  async function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      const res = await http.post("/users/login", {
        email: form.email,
        password: form.password,
      });

      const data = res?.data || {};
      const token =
        data.token || data.accessToken || data.access_token || data.jwt;
      const rawUser = data.user || data.profile || {};
      const normalized = normalizeUser(rawUser);
      const role = normalized.role?.toLowerCase?.() || data.role || "tourist";

      if (!token) throw new Error("Login failed: token missing");

      // persist
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(normalized));

      // update context so Dashboard immediately sees the user
      setUser(normalized);

      toast.success("Logged in successfully");

      // Navigate immediately (no setTimeout)
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Invalid email or password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-10 sm:py-16 overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#fff7ec,transparent_60%)]">
      {/* Brand */}
      <a
        href="/"
        className="text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-2 select-none 
        bg-gradient-to-r from-orange-600 via-yellow-500 to-teal-600 
        bg-clip-text text-transparent"
      >
        CeylonConnect
      </a>

      {/* Card */}
      <div className="mx-auto mt-8 w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-md p-8 sm:p-10 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] ring-1 ring-neutral-200">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-800">
            Welcome Back
          </h1>
          <p className="text-neutral-500 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <FloatingInput
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <div className="relative">
            <FloatingInput
              label="Password"
              name="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 mt-[2px] text-xs font-medium text-orange-600 hover:text-orange-500 active:scale-95 transition"
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex items-center justify-between -mt-1">
            <label className="flex items-center gap-2 text-sm text-neutral-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-400"
              />
              Remember me
            </label>
            <a
              href="/forgot-password"
              className="text-sm font-medium bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400
              font-semibold text-white shadow-md shadow-orange-300/40 transition-all duration-500
              hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-orange-200
              active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span
              className={`flex items-center justify-center gap-2 py-3 text-sm tracking-wide ${
                loading ? "opacity-0" : "opacity-100"
              }`}
            >
              Sign In
            </span>

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-neutral-600 text-sm">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="font-semibold bg-gradient-to-r from-orange-600 via-yellow-500 to-teal-600 bg-clip-text text-transparent hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
