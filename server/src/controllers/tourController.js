import Tour from "../models/tourModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";

const toNumberOrUndefined = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const toTrimmedStringOrUndefined = (value) => {
  if (value === undefined || value === null) return undefined;
  const s = String(value).trim();
  return s ? s : undefined;
};

const ALLOWED_CATEGORIES = new Set([
  // New UI categories (client sends capitalized values; we lowercase in normalizeTourPayload)
  "accommodation",
  "transportation",
  "food",
  "guide",
  "activity",
  "equipment",

  // Legacy categories (kept for backwards compatibility)
  "cultural",
  "eco",
  "adventure",
  "historical",
  "wellness",
]);

const normalizeTourPayload = (body = {}) => {
  // Accept both snake_case (db) and camelCase (client UI)
  const provider_id =
    body.provider_id ?? body.providerId ?? body.providerID ?? body.provider;

  const title = toTrimmedStringOrUndefined(body.title);
  const description = toTrimmedStringOrUndefined(body.description);

  const price = toNumberOrUndefined(body.price);
  const duration_hours =
    toNumberOrUndefined(body.duration_hours) ??
    toNumberOrUndefined(body.durationHours);

  const max_group_size =
    toNumberOrUndefined(body.max_group_size) ??
    toNumberOrUndefined(body.groupSize);

  // UI uses "location" input for district. Keep both aligned.
  const rawDistrict = toTrimmedStringOrUndefined(body.district);
  const rawLocation = toTrimmedStringOrUndefined(body.location);
  const district = rawDistrict ?? rawLocation;
  const location = rawLocation ?? rawDistrict;

  const category = toTrimmedStringOrUndefined(body.category);

  const images = Array.isArray(body.images)
    ? body.images
    : body.image
    ? [body.image]
    : [];

  return {
    provider_id: toNumberOrUndefined(provider_id),
    title,
    description,
    price,
    duration_hours,
    location,
    district,
    category: category ? category.toLowerCase() : undefined,
    max_group_size,
    images,
    itinerary: body.itinerary,
    sustainability_info: body.sustainability_info ?? body.sustainabilityInfo,
    safety_badge_required:
      body.safety_badge_required ?? body.safetyBadgeRequired,
  };
};

export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ message: "Tour created successfully", tour });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.findAll();
    res.status(200).json(tours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({ error: "Failed to fetch tours" });
  }
};

export const getTourById = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    res.json(tour);
  } catch (error) {
    console.error("Error in getTourById:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getToursByProvider = async (req, res) => {
  try {
    const tours = await Tour.getByProvider(req.params.providerId);
    res.json(tours);
  } catch (error) {
    console.error("Error fetching provider tours:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.update(req.params.id, req.body);
    res.json({ message: "Tour updated", tour });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTour = await Tour.delete(id);

    if (!deletedTour) return res.status(404).json({ error: "Tour not found" });
    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({ error: "Failed to delete tour" });
  }
};
export const getToursByDistrict = async (req, res) => {
  try {
    const data = await Tour.getToursByDistrict();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getToursByDistrict controller:", error);
    res.status(500).json({ error: "Server error while fetching district data" });
  }
};
