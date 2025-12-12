import { api, normalizeList } from "./client";

export const getReviewsByGuide = async (guideId) => {
  const res = await api.get(`/reviews/guide/${encodeURIComponent(guideId)}`);
  return normalizeList(res);
};

export const getGuideAverageRating = (guideId) =>
  api.get(`/reviews/guide/${encodeURIComponent(guideId)}/average`);

export const getReviewsByTour = async (tourId) => {
  const res = await api.get(`/reviews/tour/${encodeURIComponent(tourId)}`);
  return normalizeList(res);
};
