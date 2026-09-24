import api from "./api";

/*
  Register user
  POST /api/auth/register
*/
export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};


/*
  Login user
  POST /api/auth/login
*/
export const loginUser = async (loginData) => {
  const response = await api.post(
    "/auth/login",
    loginData
  );

  return response.data;
};


/*
  Logout user

  Logout ke liye backend API ki zarurat nahi hai.
  JWT localStorage se remove karna enough hai.
*/
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};


/*
  Get logged-in user from localStorage
*/
export const getStoredUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Invalid stored user:", error);

    localStorage.removeItem("user");

    return null;
  }
};


/*
  Check whether user is logged in
*/
export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};