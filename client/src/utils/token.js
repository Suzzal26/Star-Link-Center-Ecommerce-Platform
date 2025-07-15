export const setToken = (payload) => {
  console.log("Setting token:", payload); // ✅ Debugging
  localStorage.setItem("access_token", payload);
};

export const getToken = () => {
  const token = localStorage.getItem("access_token");
  console.log("Retrieved Token:", token); // ✅ Debugging
  return token;
};




export const removeToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("currentUser"); // ✅ Also remove stored user data
};
