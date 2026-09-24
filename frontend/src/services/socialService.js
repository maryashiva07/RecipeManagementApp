import api from "./api";


/* =====================================================
   FAVORITES
   ===================================================== */


/*
  Add recipe to favorites

  POST /api/favorites/:recipeId
*/
export const addFavorite = async (recipeId) => {
  const response = await api.post(
    `/favorites/${recipeId}`
  );

  return response.data;
};


/*
  Remove recipe from favorites

  DELETE /api/favorites/:recipeId
*/
export const removeFavorite = async (recipeId) => {
  const response = await api.delete(
    `/favorites/${recipeId}`
  );

  return response.data;
};


/*
  Get all favorites

  GET /api/favorites
*/
export const getFavorites = async () => {
  const response = await api.get(
    "/favorites"
  );

  return response.data;
};


/* =====================================================
   COLLECTIONS
   ===================================================== */


/*
  Create collection

  POST /api/collections
*/
export const createCollection = async (collectionData) => {
  const response = await api.post(
    "/collections",
    collectionData
  );

  return response.data;
};


/*
  Get all collections

  GET /api/collections
*/
export const getCollections = async () => {
  const response = await api.get(
    "/collections"
  );

  return response.data;
};


/*
  Get single collection

  GET /api/collections/:id
*/
export const getCollectionById = async (
  collectionId
) => {
  const response = await api.get(
    `/collections/${collectionId}`
  );

  return response.data;
};


/*
  Update collection

  PUT /api/collections/:id
*/
export const updateCollection = async (
  collectionId,
  collectionData
) => {
  const response = await api.put(
    `/collections/${collectionId}`,
    collectionData
  );

  return response.data;
};


/*
  Delete collection

  DELETE /api/collections/:id
*/
export const deleteCollection = async (
  collectionId
) => {
  const response = await api.delete(
    `/collections/${collectionId}`
  );

  return response.data;
};


/*
  Add recipe to collection

  POST /api/collections/:collectionId/recipes/:recipeId
*/
export const addRecipeToCollection = async (
  collectionId,
  recipeId
) => {
  const response = await api.post(
    `/collections/${collectionId}/recipes/${recipeId}`
  );

  return response.data;
};


/*
  Remove recipe from collection

  DELETE /api/collections/:collectionId/recipes/:recipeId
*/
export const removeRecipeFromCollection = async (
  collectionId,
  recipeId
) => {
  const response = await api.delete(
    `/collections/${collectionId}/recipes/${recipeId}`
  );

  return response.data;
};


/* =====================================================
   REVIEWS
   ===================================================== */


/*
  Create review

  POST /api/reviews/:recipeId
*/
export const createReview = async (
  recipeId,
  reviewData
) => {
  const response = await api.post(
    `/reviews/recipe/${recipeId}`,
    reviewData
  );

  return response.data;
};


/*
  Get reviews of a recipe

  GET /api/reviews/recipe/:recipeId
*/
export const getRecipeReviews = async (
  recipeId
) => {
  const response = await api.get(
    `/reviews/recipe/${recipeId}`
  );

  return response.data;
};


/*
  Update review

  PUT /api/reviews/:id
*/
export const updateReview = async (
  reviewId,
  reviewData
) => {
  const response = await api.put(
    `/reviews/${reviewId}`,
    reviewData
  );

  return response.data;
};


/*
  Delete review

  DELETE /api/reviews/:id
*/
export const deleteReview = async (
  reviewId
) => {
  const response = await api.delete(
    `/reviews/${reviewId}`
  );

  return response.data;
};


/* =====================================================
   FOLLOW
   ===================================================== */


/*
  Follow user

  POST /api/follows/:userId
*/
export const followUser = async (userId) => {
  const response = await api.post(
    `/follows/${userId}`
  );

  return response.data;
};


/*
  Unfollow user

  DELETE /api/follows/:userId
*/
export const unfollowUser = async (userId) => {
  const response = await api.delete(
    `/follows/${userId}`
  );

  return response.data;
};


/*
  Get followers

  GET /api/follows/followers
*/
// export const getFollowers = async () => {
//   const response = await api.get(
//     "/follows/${userId}/followers"
//   );

//   return response.data;
// };

export const getFollowers = async () => {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const response = await api.get(
    `/follows/${user.id}/followers`
  );

  return response.data;
};



/*
  Get following

  GET /api/follows/following
*/
// export const getFollowing = async () => {
//   const response = await api.get(
//     "/follows/following"
//   );

//   return response.data;
// };

export const getFollowing = async () => {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const response = await api.get(
    `/follows/${user.id}/following`
  );

  return response.data;
};


/* =====================================================
   FEED
   ===================================================== */


/*
  Get activity feed

  GET /api/feed
*/
export const getFeed = async () => {
  const response = await api.get(
    "/feed"
  );

  return response.data;
};


/* =====================================================
   ADMIN
   ===================================================== */


/*
  Get all users

  GET /api/admin/users
*/
export const getAdminUsers = async () => {
  const response = await api.get(
    "/admin/users"
  );

  return response.data;
};


/*
  Ban user

  PUT /api/admin/users/:id/ban
*/
export const banUser = async (userId) => {
  const response = await api.put(
    `/admin/users/${userId}/ban`
  );

  return response.data;
};


/*
  Approve user

  PUT /api/admin/users/:id/approve
*/
export const approveUser = async (userId) => {
  const response = await api.put(
    `/admin/users/${userId}/approve`
  );

  return response.data;
};


/*
  Delete user

  DELETE /api/admin/users/:id
*/
export const deleteUser = async (userId) => {
  const response = await api.delete(
    `/admin/users/${userId}`
  );

  return response.data;
};


/*
  Get all recipes for admin

  GET /api/admin/recipes
*/
export const getAdminRecipes = async () => {
  const response = await api.get(
    "/admin/recipes"
  );

  return response.data;
};


/*
  Delete recipe by admin

  DELETE /api/admin/recipes/:id
*/
export const adminDeleteRecipe = async (
  recipeId
) => {
  const response = await api.delete(
    `/admin/recipes/${recipeId}`
  );

  return response.data;
};