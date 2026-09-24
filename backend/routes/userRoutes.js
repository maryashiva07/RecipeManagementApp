const express = require("express");

const router = express.Router();

const {
  getMyProfile,
  updateProfile,
  getUserById,
  getUserRecipes,
  getMyFavorites,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const { uploadProfile } = require("../middleware/uploadMiddleware");

// Get logged-in user's profile
router.get("/profile", authMiddleware, getMyProfile);

// Update profile
router.put(
  "/profile",
  authMiddleware,
  uploadProfile.single("profileImage"),
  updateProfile,
);

// Get another user's profile
router.get("/:id", authMiddleware, getUserById);

// Get user's recipes
router.get("/:id/recipes", authMiddleware, getUserRecipes);

// Get logged-in user's favorite recipes
router.get("/me/favorites", authMiddleware, getMyFavorites);

module.exports = router;
