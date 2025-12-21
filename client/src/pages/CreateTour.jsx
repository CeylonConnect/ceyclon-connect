import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../state/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function CreateTour() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // tour ID for editing
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [district, setDistrict] = useState("");
  const [duration, setDuration] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // keep existing images for edit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing tour details if editing
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/tours/${id}`, { withCredentials: true })
      .then((res) => {
        const tour = res.data;
        setTitle(tour.title || "");
        setDescription(tour.description || "");
        setPrice(tour.price || "");
        setLocation(tour.location || "");
        setDistrict(tour.district || "");
        setDuration(tour.duration_hours || "");
        setGroupSize(tour.max_group_size || "");
        setSpecialRequests(tour.special_requests || "");
        setExistingImages(tour.images || []);
      })
      .catch((err) => {
        console.error("Failed to load tour:", err);
        setError("Failed to load tour details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleFileChange = (e) => setImages([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("provider_id", user.user_id);
      formData.append("title", title || "");
      formData.append("description", description || "");
      formData.append("price", price || "");
      formData.append("location", location || "");
      formData.append("district", district || "");
      formData.append("duration", duration || "");
      formData.append("group_size", groupSize || "");
      formData.append("special_requests", specialRequests || "");

      images.forEach((file) => formData.append("images", file));

      if (id) {
        // Edit mode
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/tours/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        alert("Tour updated successfully!");
      } else {
        // Create mode
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/tours`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        alert("Tour created successfully!");
      }

      navigate("/guide/tours");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-10 bg-sand-50">
        <section className="max-w-3xl p-6 mx-auto bg-white shadow-md rounded-2xl">
          <h1 className="mb-4 text-2xl font-bold text-neutral-900">
            {id ? "Edit Tour" : "Create New Tour"}
          </h1>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Title */}
            <div>
              <label className="block mb-1 font-semibold text-neutral-700">Title*</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border border-neutral-300 rounded-xl"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-semibold text-neutral-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded-xl"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block mb-1 font-semibold text-neutral-700">Price* (USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full p-2 border border-neutral-300 rounded-xl"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block mb-1 font-semibold text-neutral-700">Location*</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full p-2 border border-neutral-300 rounded-xl"
              />
            </div>

            {/* District */}
            <div>
              <label className="block mb-1 font-semibold text-neutral-700">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded-xl"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block mb-1 font-semibold text-neutral-700">Duration (hours)</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded-xl"
              />
            </div>

            {/* Group Size */}
            <div>
              <label className="block mb-1 font-semibold text-neutral-700">Max Group Size</label>
              <input
                type="number"
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded-xl"
              />
            </div>

            {/* Special Requests */}
            <div>
              <label className="block mb-1 font-semibold text-neutral-700">Special Requests</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded-xl"
              />
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-2">
                <p className="font-semibold text-neutral-700">Existing Images:</p>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((img, i) => (
                    <img key={i} src={img} alt="tour" className="object-cover w-20 h-20 rounded-md" />
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            <div>
              <label className="block mb-1 font-semibold text-neutral-700">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-neutral-300 rounded-xl"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 font-semibold text-white transition bg-neutral-900 rounded-xl hover:bg-neutral-800"
            >
              {loading ? (id ? "Updating..." : "Creating...") : id ? "Update Tour" : "Create Tour"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
