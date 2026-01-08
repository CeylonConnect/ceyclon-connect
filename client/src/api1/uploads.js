import { api } from "./client";

export const getCloudinarySignature = async (folder = "tours") => {
  const q = folder ? `?folder=${encodeURIComponent(folder)}` : "";
  return api.get(`/uploads/cloudinary-signature${q}`);
};

