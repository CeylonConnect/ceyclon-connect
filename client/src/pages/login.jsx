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

 // If user already logged in, bounce away from /login (role-aware)
  useEffect(() => {
    const routeForRole = (role) =>
      role === "local" || role === "guide" ? "/local" : "/dashboard";

    if (authUser) {
      const role = authUser.role?.toLowerCase?.();
      const dest = next || routeForRole(role);
      navigate(dest, { replace: true });
      return;
    }

     // If a token exists, try to route based on stored user role
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");
    if (token) {
      try {
        const raw = localStorage.getItem("user");
        const role = raw ? JSON.parse(raw)?.role?.toLowerCase?.() : undefined;
        const dest = next || routeForRole(role);
        navigate(dest, { replace: true });
      } catch {
        navigate(next || "/dashboard", { replace: true });
      }
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
      if (next) {
        navigate(next, { replace: true });
      } else if (role === "guide" || role === "local") {
        navigate("/local", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
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
