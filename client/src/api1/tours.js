import { api, normalizeList } from "./client";

export const createTour = (data) => api.post("/tours", data);

export const getAllTours = async () => {
  const res = await api.get("/tours");
  return normalizeList(res);
};

export const getTourById = async (id) => {
  return api.get(`/tours/${encodeURIComponent(id)}`);
};

const DEFAULT_TOUR_IMAGE = "https://via.placeholder.com/800x400?text=Tour";
const DEFAULT_GUIDE_AVATAR = "https://via.placeholder.com/96?text=Guide";

const normalizeCurrency = (currency) => {
  const c = String(currency || "").trim();
  if (!c || c === "$") return "Rs. ";
  return c;
};

// Map backend tour rows (snake_case) into the UI card shape used by FeaturedExperiences.
export const toExperienceItem = (t) => {
  const id = t?.tour_id ?? t?.id ?? t?._id;
  const firstName = t?.first_name ?? t?.firstName;
  const lastName = t?.last_name ?? t?.lastName;
  const guideName =
    `${firstName || ""} ${lastName || ""}`.trim() || "Local Guide";
  const badgeStatus = (t?.badge_status ?? t?.badgeStatus ?? "")
    .toString()
    .toLowerCase();

  return {
    id,
    // The app route is /tours/:slug (legacy). For DB tours we use the numeric id.
    slug: String(t?.slug ?? id ?? ""),
    title: t?.title || "Untitled tour",
    excerpt: t?.excerpt || t?.description || "",
    image:
      t?.image ||
      (Array.isArray(t?.images) ? t.images[0] : undefined) ||
      DEFAULT_TOUR_IMAGE,
    location: t?.location || t?.district || "",
    durationHours: t?.durationHours ?? t?.duration_hours ?? 0,
    groupSize: t?.groupSize ?? t?.max_group_size ?? 10,
    category: t?.category || "cultural",
    currency: normalizeCurrency(t?.currency),
    price: Number(t?.price ?? 0),
    // Ratings are not implemented in DB responses yet; keep UI stable.
    rating: {
      value: Number(t?.rating?.value ?? t?.rating_value ?? 0),
      count: Number(t?.rating?.count ?? t?.rating_count ?? 0),
    },
    guide: {
      name: t?.guide?.name || guideName,
      avatar:
        t?.guide?.avatar ||
        t?.guide_image ||
        t?.profile_picture ||
        DEFAULT_GUIDE_AVATAR,
      verified: Boolean(t?.guide?.verified) || badgeStatus === "verified",
    },
  };
};

export const getToursByProvider = async (providerId) => {
  const res = await api.get(
    `/tours/provider/${encodeURIComponent(providerId)}`
  );
  return normalizeList(res);
};

export const updateTour = (id, data) => api.put(`/tours/${id}`, data);

export const deleteTour = (id) => api.del(`/tours/${id}`);
