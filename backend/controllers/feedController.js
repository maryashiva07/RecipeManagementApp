const { Activity, User, Recipe, Review, Follow } = require("../models");

// GET ACTIVITY FEED

const getActivityFeed = async (req, res) => {
  try {
    // Find users that current user follows

    const following = await Follow.findAll({
      where: {
        followerId: req.user.id,
      },

      attributes: ["followingId"],
    });

    const followingIds = following.map((item) => item.followingId);

    // If user follows nobody

    if (followingIds.length === 0) {
      return res.status(200).json({
        success: true,

        count: 0,

        activities: [],
      });
    }

    const activities = await Activity.findAll({
      where: {
        UserId: followingIds,
      },

      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "profileImage"],
        },

        {
          model: Recipe,
          as: "recipe",
        },

        {
          model: Review,
          as: "review",
        },
      ],

      order: [["createdAt", "DESC"]],

      limit: 30,
    });

    res.status(200).json({
      success: true,

      count: activities.length,

      activities,
    });
  } catch (error) {
    console.error("Activity feed error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activity feed",
    });
  }
};

module.exports = {
  getActivityFeed,
};
