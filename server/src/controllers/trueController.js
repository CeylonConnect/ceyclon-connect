import Tour from "../models/tourModel.js";

export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ message: "Tour created successfully", tour });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
