import api from "./api";


/*
  Get my profile

  GET /api/users/profile
*/
export const getMyProfile = async () => {
  const response = await api.get(
    "/users/profile"
  );

  return response.data;
};


/*
  Update my profile

  This can receive normal JSON
  or FormData when profile image
  is uploaded.
*/
export const updateProfile = async (data) => {
  const isFormData = data instanceof FormData;

  const response = await api.put(
    "/users/profile",
    data,
    isFormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      : undefined
  );

  return response.data;
};


/*
  Get another user's profile

  GET /api/users/:id
*/
export const getUserById = async (userId) => {
  const response = await api.get(
    `/users/${userId}`
  );

  return response.data;
};


/*
  Get recipes created by a user

  GET /api/users/:id/recipes
*/
export const getUserRecipes = async (userId) => {
  const response = await api.get(
    `/users/${userId}/recipes`
  );

  return response.data;
};


/*
  Get current user's favorites

  GET /api/users/favorites
*/
export const getMyFavorites = async () => {
  const response = await api.get(
    "/users/favorites"
  );

  return response.data;
};