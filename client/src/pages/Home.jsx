import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-blue-300">
      <h1 className="text-4xl font-bold mb-4">Welcome Home!</h1>
      <button
        onClick={() => navigate("/login")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-semibold transition-all"
      >
        Go to Login Page
      </button>
    </div>
  );
}

export default Home;