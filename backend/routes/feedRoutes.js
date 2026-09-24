const express = require("express");

const router = express.Router();

const { getActivityFeed } = require("../controllers/feedController");

const authMiddleware = require("../middleware/authMiddleware");

// Get activity feed
router.get("/", authMiddleware, getActivityFeed);

module.exports = router;
