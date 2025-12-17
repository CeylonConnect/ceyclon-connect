import React, { useState } from "react";
import FloatingInput from "../components/FloatingInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { signup as signupService } from "../services/auth";

export default function SignupPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "";

  const [role, setRole] = useState("tourist"); // tourist | guide
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!/^\+?[0-9\s-]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);

    try {
      const res = await signupService({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role, // tourist | guide
      });

      if (res.status === 201) {
        toast.success(`Signed up successfully as ${role}!`);
        // Clear any previous auth state
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to login
        navigate(next ? `/login?next=${encodeURIComponent(next)}` : "/login", { replace: true });
      }
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-10 sm:py-16 overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#fff7ec,transparent_60%)]">
      <a
        href="/"
        className="mb-4 text-2xl font-extrabold text-transparent select-none sm:text-4xl sm:mb-2 bg-gradient-to-r from-orange-600 via-yellow-500 to-teal-600 bg-clip-text"
      >
        CeylonConnect
      </a>

      <div className="w-full max-w-md p-8 mx-auto mt-8 shadow rounded-3xl bg-white/90 backdrop-blur-md sm:p-10 ring-1 ring-neutral-200">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl text-neutral-800">Create Account</h1>
          <p className="text-sm text-neutral-500">Join as a traveler or guide</p>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 mt-6 rounded-2xl bg-orange-50/60 ring-1 ring-neutral-200">
          <button
            type="button"
            onClick={() => setRole("tourist")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              role === "tourist" ? "bg-white shadow-sm" : "text-neutral-600 hover:text-neutral-800"
            }`}
          >
            I'm a Traveler
          </button>
          <button
            type="button"
            onClick={() => setRole("guide")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              role === "guide" ? "bg-white shadow-sm" : "text-neutral-600 hover:text-neutral-800"
            }`}
          >
            I'm a Guide
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FloatingInput label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
            <FloatingInput label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} />
          </div>

          <FloatingInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
          <FloatingInput label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} />

          <div className="relative">
            <FloatingInput label="Password" name="password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange} error={errors.password} className="pr-12" />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute text-xs text-orange-600 -translate-y-1/2 right-3 top-1/2">
              {showPw ? "Hide" : "Show"}
            </button>
          </div>

          <div className="relative">
            <FloatingInput label="Confirm Password" name="confirm" type={showPw2 ? "text" : "password"} value={form.confirm} onChange={handleChange} error={errors.confirm} className="pr-12" />
            <button type="button" onClick={() => setShowPw2((s) => !s)} className="absolute text-xs text-orange-600 -translate-y-1/2 right-3 top-1/2">
              {showPw2 ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" disabled={loading} className="relative w-full overflow-hidden font-semibold text-white shadow-md rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 shadow-orange-300/40 hover:brightness-105 disabled:opacity-70">
            <span className={`flex items-center justify-center py-3 text-sm ${loading ? "opacity-0" : "opacity-100"}`}>Create Account</span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 rounded-full border-white/70 border-t-transparent animate-spin" />
              </div>
            )}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-neutral-600">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-transparent bg-gradient-to-r from-orange-600 via-yellow-500 to-teal-600 bg-clip-text hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
