import axios from "axios";

// Use relative paths for local development with Vite proxy
const AUTH_BASE = "/api/v1/auth";

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_BASE}/register`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_BASE}/login`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    await axios.post(`${AUTH_BASE}/logout`, {}, { withCredentials: true });
  } catch (error) {
    throw error.response.data;
  }
};
