import { api, normalizeList } from "./client";

export const createReview = (data) => api.post("/reviews", data);

export const getReviewsByGuide = async (guideId) => {
  const res = await api.get(`/reviews/guide/${encodeURIComponent(guideId)}`);
  return normalizeList(res);
};

export const getGuideAverageRating = (guideId) =>
  api
    .get(`/reviews/guide/${encodeURIComponent(guideId)}/average`)
    .then((res) => ({
      ...res,
      average: Number(res?.average ?? res?.average_rating ?? 0),
      total: Number(res?.total ?? res?.total_reviews ?? 0),
    }));

export const getReviewsByTour = async (tourId) => {
  const res = await api.get(`/reviews/tour/${encodeURIComponent(tourId)}`);
  return normalizeList(res);
};

export const getAverageRating = (tourId) =>
  api
    .get(`/reviews/tour/${encodeURIComponent(tourId)}/average`)
    .then((res) => ({
      ...res,
      average: Number(res?.average ?? res?.average_rating ?? 0),
      total: Number(res?.total ?? res?.total_reviews ?? 0),
    }));
