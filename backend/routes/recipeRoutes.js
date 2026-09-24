const express = require("express");

const router = express.Router();

const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");

const authMiddleware = require("../middleware/authMiddleware");

const { uploadRecipe } = require("../middleware/uploadMiddleware");

// Get all recipes
router.get("/", getAllRecipes);

// Get single recipe
router.get("/:id", getRecipeById);

// Create recipe
router.post("/", authMiddleware, uploadRecipe.single("image"), createRecipe);

// Update recipe
router.put("/:id", authMiddleware, uploadRecipe.single("image"), updateRecipe);

// Delete recipe
router.delete("/:id", authMiddleware, deleteRecipe);

module.exports = router;
