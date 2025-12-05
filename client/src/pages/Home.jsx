import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar
        isAuthenticated={false}
        onLoginClick={() => navigate("/login")}
        onSignupClick={() => navigate("/signup")}
        onDashboardClick={() => navigate("/dashboard")}
      />
      <main></main>
    </>
  );
}
