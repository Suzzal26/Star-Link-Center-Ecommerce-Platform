import instance from "../utils/axios";
import { APIs } from "../constants";

// ✅ Register User with Improved Error Handling
export const register = async (payload) => {
  try {
    const response = await instance.post(APIs.USERS + "/register", payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    console.log("✅ Register API Response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Register API Error:", error.response || error);
    throw error;
  }
};

// ✅ Login User
export const login = async (payload) => {
  try {
    console.log("📤 Sending Login Request to:", APIs.USERS + "/login");
    console.log("🛠️ Login Request Payload:", payload);

    const response = await instance.post(APIs.USERS + "/login", payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    console.log("✅ Login API Response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Login API Error:", error.response || error);
    throw error;
  }
};

// ✅ Forgot Password - Generate OTP
export const generateFPToken = (payload) => {
  return instance.post(APIs.USERS + "/generate-fp-token", payload, {
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });
};

// ✅ Verify OTP for Password Reset
export const verifyFPToken = (payload) => {
  return instance.post(APIs.USERS + "/verify-fp-token", payload, {
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });
};

// ✅ Reset Password via OTP
export const resetPassword = ({ email, otp, newPassword }) => {
  return instance.post(
    APIs.USERS + "/reset-password",
    { email, otp, newPassword },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );
};


// ✅ Get All Users
export const getAllUsers = ({ limit, page, name }) => {
  return instance.get(
    `${APIs.USERS}?page=${page}&limit=${limit}&name=${name}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

// ✅ Get a Single User by ID
export const getOneUser = (id) => {
  return instance.get(`${APIs.USERS}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// ✅ Add a New User
export const addUser = (payload) => {
  return instance.post(APIs.USERS, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// ✅ Get User Profile
export const getProfile = () => {
  return instance.get(`${APIs.USERS}/get-profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// ✅ Block/Unblock User
export const blockUser = (email) => {
  return instance.patch(
    `${APIs.USERS}/block-user`,
    { email },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};
