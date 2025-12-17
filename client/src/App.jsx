import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Tours from "./pages/tour.jsx";
import TourDetails from "./pages/TourDetails.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Event from "./pages/Events.jsx";
import About from "./pages/about.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import LocalDashboard from "./pages/LocalDashboard.jsx";
import { AuthProvider } from "./state/AuthContext";
import { BookingProvider } from "./state/BookingContext";

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:slug" element={<TourDetails />} />

          <Route path="/events" element={<Event />} />
          <Route path="/about" element={<About />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/local" element={<LocalDashboard />} />

          <Route path="*" element={<div className="p-8 text-center">Page not found</div>} />
        </Routes>
      </BookingProvider>
    </AuthProvider>
  );
}