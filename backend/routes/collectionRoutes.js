const express = require("express");

const router = express.Router();

const {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addRecipeToCollection,
  removeRecipeFromCollection,
} = require("../controllers/collectionController");

const authMiddleware = require("../middleware/authMiddleware");

// Create collection
router.post("/", authMiddleware, createCollection);

// Get all my collections
router.get("/", authMiddleware, getCollections);

// Get single collection
router.get("/:id", authMiddleware, getCollectionById);

// Update collection
router.put("/:id", authMiddleware, updateCollection);

// Delete collection
router.delete("/:id", authMiddleware, deleteCollection);

// Add recipe to collection
router.post("/:id/recipes/:recipeId", authMiddleware, addRecipeToCollection);

// Remove recipe from collection
router.delete(
  "/:id/recipes/:recipeId",
  authMiddleware,
  removeRecipeFromCollection,
);

module.exports = router;
