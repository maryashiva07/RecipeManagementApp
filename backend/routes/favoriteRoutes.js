const express = require("express");

const router = express.Router();

const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require("../controllers/favoriteController");

const authMiddleware = require("../middleware/authMiddleware");

// Get my favorites
router.get("/", authMiddleware, getFavorites);

// Add recipe to favorites
router.post("/:recipeId", authMiddleware, addFavorite);

// Remove recipe from favorites
router.delete("/:recipeId", authMiddleware, removeFavorite);

module.exports = router;
