import { createContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../api/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user)); // ✅ Ensure user is stored properly
  }, [user]);

  const login = async (userData) => {
    const response = await loginUser(userData);
    if (response.user) {
      setUser(response.user);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
