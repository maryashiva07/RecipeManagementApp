const express = require("express");

const router = express.Router();

const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} = require("../controllers/followController");

const authMiddleware = require("../middleware/authMiddleware");

// Follow user
router.post("/:userId", authMiddleware, followUser);

// Unfollow user
router.delete("/:userId", authMiddleware, unfollowUser);

// Get followers
router.get("/:userId/followers", authMiddleware, getFollowers);

// Get following
router.get("/:userId/following", authMiddleware, getFollowing);

module.exports = router;
