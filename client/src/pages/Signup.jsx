import React, { useState } from "react";
import FloatingInput from "../components/FloatingInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import http from "../lib/http";
import { toast } from "react-toastify";

export default function SignupPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "";

  const [role, setRole] = useState("tourist"); // "tourist" | "guide"
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
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
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!/^\+?[0-9\s-]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  }

  async function uploadProfileImage(file) {
    if (!file) return "";

    // Basic client-side guardrails
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error("Image too large (max 5MB)");
    }

    // Get a public signature for profile uploads
    const sigRes = await http.get("/uploads/cloudinary-signature/public");
    const { cloudName, apiKey, timestamp, folder, signature } =
      sigRes.data || {};
    if (!cloudName || !apiKey || !timestamp || !folder || !signature) {
      throw new Error("Upload config missing (Cloudinary signature failed)");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("folder", folder);
    formData.append("signature", signature);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(
        cloudName
      )}/auto/upload`,
      { method: "POST", body: formData }
    );
    const cloudJson = await cloudRes.json();
    if (!cloudRes.ok) {
      const msg = cloudJson?.error?.message || "Cloudinary upload failed";
      throw new Error(msg);
    }

    return cloudJson?.secure_url || "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      let profilePictureUrl = "";
      if (profileFile) {
        setImageUploading(true);
        profilePictureUrl = await uploadProfileImage(profileFile);
      }

      const res = await http.post("/users/register", {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role, // "tourist" | "guide"
        ...(profilePictureUrl ? { profile_picture: profilePictureUrl } : {}),
      });

      const ok =
        res.status === 201 ||
        res.data?.success === true ||
        !!res.data?.user ||
        !!res.data?.id ||
        !!res.data?._id;

      if (ok) {
        toast.success(`Signed up successfully as ${role}!`);
        setTimeout(() => {
          // After signup, go Home per requirement.
          navigate("/", { replace: true });
        }, 600);
      } else {
        toast.error(res.data?.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Something went wrong"
      );
    } finally {
      setImageUploading(false);
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
            Create Account
          </h1>
          <p className="text-neutral-500 text-sm">
            Join as a traveler or become a local guide
          </p>
        </div>

        {/* Role selector */}
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gradient-to-r from-orange-600 via-yellow-500 to-teal-600  p-1 ring-1 ring-neutral-200">
            <button
              type="button"
              onClick={() => setRole("tourist")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                role === "tourist"
                  ? "bg-white text-neutral-800 shadow-sm ring-1 ring-white"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              I'm a Traveler
            </button>
            <button
              type="button"
              onClick={() => setRole("local")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                role === "local"
                  ? "bg-white text-neutral-800 shadow-sm ring-1 ring-white"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              I'm a Guide
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {/* Profile image */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full ring-1 ring-neutral-200 bg-neutral-50">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-neutral-800">
                  Profile Image{" "}
                  <span className="text-neutral-500 font-normal">
                    (optional)
                  </span>
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  JPG/PNG recommended. Max 5MB.
                </div>
              </div>
            </div>
            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setProfileFile(file);
                  if (!file) {
                    setProfilePreview("");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () =>
                    setProfilePreview(String(reader.result || ""));
                  reader.readAsDataURL(file);
                }}
                className="block w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-neutral-700 hover:file:bg-neutral-200"
              />
              {imageUploading && (
                <div className="mt-2 text-xs text-neutral-600">
                  Uploading image...
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FloatingInput
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              error={errors.firstName}
              autoComplete="given-name"
            />
            <FloatingInput
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              error={errors.lastName}
              autoComplete="family-name"
            />
          </div>

          <FloatingInput
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <FloatingInput
            label="Phone Number"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <div className="relative">
            <FloatingInput
              label="Password"
              name="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
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

          <div className="relative">
            <FloatingInput
              label="Confirm Password"
              name="confirm"
              type={showPw2 ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              error={errors.confirm}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPw2((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 mt-[2px] text-xs font-medium text-orange-600 hover:text-orange-500 active:scale-95 transition"
            >
              {showPw2 ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || imageUploading}
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
              Create Account
            </span>
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-neutral-600 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold bg-gradient-to-r from-orange-600 via-yellow-500 to-teal-600 bg-clip-text text-transparent hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
