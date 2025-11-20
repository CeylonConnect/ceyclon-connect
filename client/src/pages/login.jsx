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
