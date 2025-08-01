import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/auth";

// Register User
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, {
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
        const response = await axios.post(`${API_URL}/login`, userData, {
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
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (error) {
        throw error.response.data;
    }
};
