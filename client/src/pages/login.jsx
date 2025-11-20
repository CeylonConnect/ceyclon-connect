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
