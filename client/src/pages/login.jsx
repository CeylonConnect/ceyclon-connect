import React, { useState } from "react";
import FloatingInput from "../components/FloatingInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { login as loginService } from "../services/auth";
import { useAuth } from "../state/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [params] = useSearchParams();
  const next = params.get("next") || "";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginService(form.email, form.password);
      const userData = res.data.user;

      // Save to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      toast.success(`Welcome back, ${userData.firstName || "Traveler"}!`);

      if (next) navigate(next, { replace: true });
      else navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-10 sm:py-16 overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#fff7ec,transparent_60%)]">
      <a href="/" className="mb-4 text-2xl font-extrabold text-transparent select-none sm:text-4xl sm:mb-2 bg-gradient-to-r from-orange-600 via-yellow-500 to-teal-600 bg-clip-text">
        CeylonConnect
      </a>

      <div className="w-full max-w-md p-8 mx-auto mt-8 shadow rounded-3xl bg-white/90 backdrop-blur-md sm:p-10 ring-1 ring-neutral-200">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl text-neutral-800">Sign In</h1>
          <p className="text-sm text-neutral-500">Enter your credentials</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <FloatingInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <FloatingInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

          <button type="submit" disabled={loading} className="relative w-full overflow-hidden font-semibold text-white shadow-md rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 shadow-orange-300/40 hover:brightness-105 disabled:opacity-70">
            <span className={`flex items-center justify-center py-3 text-sm ${loading ? "opacity-0" : "opacity-100"}`}>Sign In</span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 rounded-full border-white/70 border-t-transparent animate-spin" />
              </div>
            )}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-neutral-600">
          Don't have an account?{" "}
          <a href="/signup" className="font-semibold text-transparent bg-gradient-to-r from-orange-600 via-yellow-500 to-teal-600 bg-clip-text hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
