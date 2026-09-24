import api from "./api";


// Get all recipes
export const getRecipes = async (params = {}) => {

    const response = await api.get("/recipes", {
        params
    });

    return response.data;
};


// Get single recipe
export const getRecipeById = async (recipeId) => {

    const response = await api.get(`/recipes/${recipeId}`);

    return response.data;
};


// Create recipe
export const createRecipe = async (formData) => {

    const response = await api.post(
        "/recipes",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


// Update recipe
export const updateRecipe = async (recipeId, formData) => {

    const response = await api.put(
        `/recipes/${recipeId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


// Delete recipe
export const deleteRecipe = async (recipeId) => {

    const response = await api.delete(
        `/recipes/${recipeId}`
    );

    return response.data;
};