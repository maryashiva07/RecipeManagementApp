const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  banUser,
  approveUser,
  deleteUser,
  getAllRecipesAdmin,
  deleteRecipeAdmin,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get all users
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// Ban user
router.put("/users/:id/ban", authMiddleware, adminMiddleware, banUser);

// Approve user
router.put("/users/:id/approve", authMiddleware, adminMiddleware, approveUser);

// Delete user
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

// Get all recipes
router.get("/recipes", authMiddleware, adminMiddleware, getAllRecipesAdmin);

// Delete recipe
router.delete(
  "/recipes/:id",
  authMiddleware,
  adminMiddleware,
  deleteRecipeAdmin,
);

module.exports = router;
