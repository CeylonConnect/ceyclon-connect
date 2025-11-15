import Tour from "../models/tourModel.js";

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

