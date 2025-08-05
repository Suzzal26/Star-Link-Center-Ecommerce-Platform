import axios from "axios";
import { API_URL } from "../constants";

// Use API_URL from constants for consistent API calls
const AUTH_BASE = `${API_URL}/auth`;

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
