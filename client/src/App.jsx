import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AllTours from "./pages/AllTours";
import TourView from "./pages/tourview";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
  <Route path="/tours" element={<AllTours />} />
  <Route path="/tours/:id" element={<TourView />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
