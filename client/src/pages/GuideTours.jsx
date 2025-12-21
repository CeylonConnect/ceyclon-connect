// client/src/pages/GuideTours.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../state/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GuideTours() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  
  const fetchTours = async () => {
    if (!user?.user_id) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/tours?provider_id=${user.user_id}`,
        { withCredentials: true }
      );
      setTours(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tours");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchTours();
  }, [user?.user_id]);

  const handleDelete = async (tourId) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;
    try {
      await axios.delete(`${backendUrl}/tours/${tourId}`, {
        withCredentials: true,
      });
      setTours((prev) => prev.filter((t) => t.id === tourId || t.tour_id === tourId ? false : true));
    } catch (err) {
      console.error(err);
      alert("Failed to delete tour");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-10 bg-sand-50">
        <section className="max-w-6xl px-4 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">Manage My Tours</h1>
            <button
              onClick={() => navigate("/guide/tours/new")}
              className="px-4 py-2 text-sm font-semibold text-white transition bg-neutral-900 rounded-xl hover:bg-neutral-800"
            >
              + Create New Tour
            </button>
          </div>

          {loading && (
            <div className="p-6 text-center bg-white border rounded-2xl border-neutral-200 text-neutral-600">
              Loading tours...
            </div>
          )}

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 border border-red-200 rounded-2xl bg-red-50">
              {error}
            </div>
          )}

          {!loading && tours.length === 0 && (
            <div className="p-6 text-center bg-white border rounded-2xl border-neutral-200 text-neutral-600">
              You have not created any tours yet.
            </div>
          )}

          <div className="grid gap-6 mt-4 md:grid-cols-2">
            {tours.map((tour) => {
              const tourId = tour.id || tour.tour_id;
              const tourImages = Array.isArray(tour.images) ? tour.images : JSON.parse(tour.images || "[]");

              return (
                <div
                  key={tourId}
                  className="overflow-hidden bg-white border shadow-sm rounded-2xl"
                >
                  {tourImages.length > 0 && (
                    <img
                      src={`${backendUrl}${tourImages[0]}`}
                      alt={tour.title}
                      className="object-cover w-full h-48"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      {tour.title}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600">{tour.description}</p>
                    <p className="mt-2 text-sm font-semibold text-neutral-800">
                      Price: ${tour.price}
                    </p>
                    {tour.duration && (
                      <p className="text-sm text-neutral-600">
                        Duration: {tour.duration} day{tour.duration > 1 ? "s" : ""}
                      </p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/guide/tours/${tourId}/edit`)}
                        className="px-3 py-1 text-sm text-white transition bg-orange-500 rounded-xl hover:bg-orange-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tourId)}
                        className="px-3 py-1 text-sm text-white transition bg-red-500 rounded-xl hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
