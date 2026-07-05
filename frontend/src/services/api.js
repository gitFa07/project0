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
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return Promise.reject(error);

        case 403:
        case 500:
        default:
          return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
