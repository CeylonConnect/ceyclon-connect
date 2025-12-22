
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
