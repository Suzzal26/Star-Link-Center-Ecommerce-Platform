import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { getToken } from "./token"; // ✅ Ensure correct import

// ✅ Check if user is logged in
export const isLoggedIn = () => {
  const token = getToken();
  if (!token) {
    console.log("No token found, user is not logged in.");
    return false;
  }

  try {
    const { exp } = jwtDecode(token);
    const now = moment().unix(); // ✅ Get current time in seconds

    if (now > exp) {
      console.log("Token expired, logging out user...");
      localStorage.removeItem("access_token"); // ✅ Remove expired token
      localStorage.removeItem("currentUser");
      return false;
    }

    console.log("Token is valid, user is logged in.");
    return true;
  } catch (e) {
    console.error("Invalid token, logging out...");
    localStorage.removeItem("access_token");
    localStorage.removeItem("currentUser");
    return false;
  }
};

// ✅ Validate user roles
export const isValidRoles = (roles = []) => {
  try {
    if (!roles.length) return true;
    const token = getToken();
    if (!token) return false;
    const user = jwtDecode(token); // ✅ Fix: Directly decode user data
    return roles.some((r) => user.role === r); // ✅ Fix: Check exact role match
  } catch (e) {
    localStorage.removeItem("access_token");
    return false;
  }
};

// ✅ Set current user after login
export const setCurrentUser = () => {
  const token = getToken();
  if (!token) {
    console.error("No token found");
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded); // ✅ Debugging
    localStorage.setItem("currentUser", JSON.stringify(decoded));
    return decoded; // ✅ Return decoded user info
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("access_token"); // ✅ Remove invalid token
    return null;
  }
};

// ✅ Get current user from local storage
export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");

  if (!user || user === "undefined") {
    console.error("No valid user found in storage.");
    return null; // ✅ Prevents crash
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Error parsing user JSON:", error);
    localStorage.removeItem("currentUser"); // ✅ Remove corrupted data
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("access_token"); // Remove token
  localStorage.removeItem("currentUser"); // Remove user data
  window.location.href = "/login"; // Redirect to login page
};

