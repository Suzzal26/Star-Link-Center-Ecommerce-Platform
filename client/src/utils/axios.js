import axios from "axios";

const instance = axios.create({
  // Remove baseURL to use relative paths with Vite proxy
  timeout: 5000,
  withCredentials: true, // ✅ Allows cookies, but let's also add token manually
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically to all requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
