import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Redirect to login page
          window.location.href = "/login";
          break;

        case 403:
          console.error("Access denied.");
          break;

        case 500:
          console.error("Internal Server Error.");
          break;

        default:
          break;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
