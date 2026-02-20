import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const msg = String(data?.message || data?.error || "");

    if (status === 403 && /account blocked/i.test(msg)) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        sessionStorage.removeItem("token");
      } catch {
        // ignore
      }

      if (typeof window !== "undefined") {
        const here = window.location?.pathname || "";
        if (!here.startsWith("/login")) {
          window.location.href =
            "/login?msg=" + encodeURIComponent("Account blocked");
        }
      }
    }

    return Promise.reject(error);
  }
);

function normalizeError(error) {
  const status = error.response?.status;
  const data = error.response?.data;
  const message =
    (typeof data === "string" && data) ||
    data?.message ||
    data?.error ||
    error.message ||
    "Request failed";

  const err = new Error(message);
  if (status) err.status = status;
  return err;
}

async function handleRequest(promise) {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export const api = {
  get: (path, config) => handleRequest(axiosInstance.get(path, config)),
  post: (path, data, config) =>
    handleRequest(axiosInstance.post(path, data, config)),
  patch: (path, data, config) =>
    handleRequest(axiosInstance.patch(path, data, config)),
  put: (path, data, config) =>
    handleRequest(axiosInstance.put(path, data, config)),
  del: (path, config) => handleRequest(axiosInstance.delete(path, config)),
};

export default api;
