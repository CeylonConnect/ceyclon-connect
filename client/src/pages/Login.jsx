import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import "../Login.css"; 

const Login = () => {
  const [state, setState] = useState("Login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (state === "Sign Up") {
        if (!firstName || !lastName || !phone) {
          toast.error("Please fill in all fields");
          return;
        }

        const res = await axios.post("http://localhost:5000/api/auth/signup", {
          first_name: firstName,
          last_name: lastName,
          phone,
          email,
          password,
        });

        toast.success(res.data.message || "Account created successfully!");
        setState("Login");
        setFirstName("");
        setLastName("");
        setPhone("");
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });

        toast.success(res.data.message || "Login successful!");
        navigate("/");
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="login-page">
      <img
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate("/")}
        className="login-logo"
      />

      <div className="login-container">
        <h2 className="login-title">
          {state === "Sign Up" ? "Create Account" : "Login Account"}
        </h2>

        <p className="login-subtitle">
          {state === "Sign Up"
            ? "Create your account below"
            : "Login to your account"}
        </p>

        <form onSubmit={onSubmitHandler} className="login-form">
          {state === "Sign Up" && (
            <>
              <div className="login-input-group">
                <img src={assets.person_icon} alt="Person" className="login-icon" />
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  type="text"
                  placeholder="First Name"
                  required
                  className="login-input"
                />
              </div>

              <div className="login-input-group">
                <img src={assets.person_icon} alt="Person" className="login-icon" />
                <input
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  type="text"
                  placeholder="Last Name"
                  required
                  className="login-input"
                />
              </div>

              <div className="login-input-group">
                <img src={assets.phone} alt="Phone" className="login-icon" />
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  type="text"
                  placeholder="Phone Number"
                  required
                  className="login-input"
                />
              </div>
            </>
          )}

          <div className="login-input-group">
            <img src={assets.mail_icon} alt="Email" className="login-icon" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              required
              className="login-input"
            />
          </div>

          <div className="login-input-group">
            <img src={assets.lock_icon} alt="Lock" className="login-icon" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="login-input"
            />
          </div>

          <button type="submit" className="login-button">
            {state}
          </button>
        </form>

        <p className="login-toggle">
          {state === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setState("Login")} className="login-link">
                Login here
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setState("Sign Up")} className="login-link">
                Sign Up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
