import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import api from "../api/client";

const BookingContext = createContext(null);

const FALLBACK_TOUR_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60";
const FALLBACK_GUIDE_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=60";

function coerceArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      if (value.includes(",")) {
        return value.split(",").map((v) => v.trim()).filter(Boolean);
      }
    }
    return [value];
  }
  return [];
}

function slugify(input) {
  if (!input) return "";
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeBooking(record = {}) {
  // Already normalized
  if (record.tour && record.guide) {
    return {
      ...record,
      id: record.id || record.booking_id || record._id || `b_${Date.now()}`,
    };
  }

  const images = coerceArray(record.images || record.tour_images);
  const guideFirst =
    record.guide_first_name || record.first_name || record.provider_first_name;
  const guideLast =
    record.guide_last_name || record.last_name || record.provider_last_name;

  const guideName = [guideFirst, guideLast].filter(Boolean).join(" ").trim();
  const tourTitle = record.title || record.tour_title;
  const location =
    record.location || record.tour_location || record.destination || "Sri Lanka";

  return {
    id: record.booking_id || record.id || record._id || `b_${Date.now()}`,
    date: record.tour_date
      ? new Date(record.tour_date).toLocaleDateString()
      : record.date || "",
    guests: record.group_size || record.guests || 1,
    total: Number(record.total_amount ?? record.total ?? 0),
    status: record.status || "pending",
    tour: {
      id: record.tour_id || record.tour?.id || record.booking_id,
      slug:
        record.slug ||
        record.tour_slug ||
        slugify(tourTitle) ||
        String(record.tour_id || record.booking_id || ""),
      title: tourTitle || record.tour?.title || "Tour experience",
      image: record.image || images[0] || FALLBACK_TOUR_IMAGE,
      location,
      durationHours: record.duration || record.duration_hours || null,
      price: Number(record.price ?? record.tour_price ?? record.total_amount ?? 0),
      currency: record.currency || record.tour?.currency || "$",
    },
    guide: {
      id:
        record.provider_id ||
        record.guide_id ||
        record.guide?.id ||
        `guide_${record.tour_id || record.booking_id}`,
      name: guideName || record.guide?.name || "Guide",
      avatar: record.guide_avatar || record.guide?.avatar || FALLBACK_GUIDE_AVATAR,
      verified:
        record.badge_status === "approved" ||
        record.guide?.verified ||
        false,
    },
  };
}

// Booking shape
// {
//   id, tour: { id, slug, title, image, location, durationHours, price, currency },
//   guide: { id, name, avatar, verified },
//   date, guests, total,
//   status: "pending" | "confirmed" | "cancelled",
//   createdAt
// }
// Messages stored per guideId:
// { [guideId]: [{ id, guideId, sender: 'user' | 'guide', text, createdAt }] }

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = ({ tour, guide, date, guests }) => {
    const total = Number(tour.price || 0) * Math.max(1, Number(guests || 1));
    const booking = {
      id: `b_${Date.now()}`,
      tour: {
        id: tour.id ?? tour.slug ?? String(Date.now()),
        slug: tour.slug,
        title: tour.title,
        image: tour.image,
        location: tour.location,
        durationHours: tour.durationHours,
        price: tour.price,
        currency: tour.currency || "$",
      },
      guide,
      date,
      guests,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [booking, ...prev]);

    // Seed a system-style message thread with the guide for this booking
    setMessages((prev) => {
      const thread = prev[guide.id] ?? [];
      return {
        ...prev,
        [guide.id]: [
          ...thread,
          {
            id: `m_${Date.now()}`,
            guideId: guide.id,
            sender: "guide",
            text:
              "Thanks for your request! I’ll review and approve shortly. Feel free to send any questions here.",
            createdAt: new Date().toISOString(),
          },
        ],
      };
    });

    return booking;
  };

  const updateBookingStatus = async (bookingId, status) => {
    let previousStatus;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          previousStatus = b.status;
          return { ...b, status };
        }
        return b;
      })
    );

    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
    } catch (err) {
      console.error("Failed to sync booking status", err);
      if (previousStatus) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: previousStatus } : b))
        );
      }
      throw err;
    }
  };

  const sendMessage = ({ guideId, sender, text }) => {
    setMessages((prev) => {
      const thread = prev[guideId] ?? [];
      return {
        ...prev,
        [guideId]: [
          ...thread,
          {
            id: `m_${Date.now()}`,
            guideId,
            sender,
            text,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    });
  };

  const loadBookings = useCallback(
    async ({ userId, role = "tourist" } = {}) => {
      if (!userId) return [];
      setLoading(true);
      setError(null);
      try {
        const path =
          role === "provider"
            ? `/bookings/provider/${encodeURIComponent(userId)}`
            : `/bookings/tourist/${encodeURIComponent(userId)}`;
        const data = await api.get(path);
        const normalized = Array.isArray(data)
          ? data.map((record) => normalizeBooking(record))
          : [];
        setBookings(normalized);
        return normalized;
      } catch (err) {
        console.error("Failed to load bookings", err);
        setError(err.message || "Unable to load bookings");
        setBookings([]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      bookings,
      messages,
      createBooking,
      updateBookingStatus,
      sendMessage,
      loadBookings,
      loading,
      error,
    }),
    [bookings, messages, loading, error, loadBookings]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}