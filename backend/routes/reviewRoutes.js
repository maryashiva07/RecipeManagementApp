const express = require("express");

const router = express.Router();

const {
  createReview,
  getRecipeReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

// Get reviews of a recipe
router.get("/recipe/:recipeId", getRecipeReviews);

// Create review
router.post("/recipe/:recipeId", authMiddleware, createReview);

// Update my review
router.put("/:id", authMiddleware, updateReview);

// Delete my review
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
