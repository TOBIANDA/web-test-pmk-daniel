import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pmkdaniel-api.danielmemory26.workers.dev/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor: Attach Bearer JWT Token automatically
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("admin_token") ||
        localStorage.getItem("pmk_admin_token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/pausmakanyunus")
    ) {
      const isAdminRoute = [
        "/daudpakeketapel",
        "/bahteranabinuh",
        "/limarotiduaikan",
        "/rumahtanggaallah",
      ].some((r) => window.location.pathname.startsWith(r));

      if (isAdminRoute) {
        window.location.href = `/pausmakanyunus?redirect=${encodeURIComponent(
          window.location.pathname
        )}`;
      }
    }
    return Promise.reject(error);
  }
);

export const api = apiClient;
export default apiClient;
