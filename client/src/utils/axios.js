import axios from "axios";
import { API_URL } from "../constants";

const instance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  withCredentials: true, // ✅ Allows cookies, but let's also add token manually
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically to all requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default instance;
