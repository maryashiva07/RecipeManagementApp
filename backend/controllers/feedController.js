const { Op } = require("sequelize");

const { User, Recipe, Review, Follow } = require("../models");

const getActivityFeed = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get users followed by current user
    const following = await Follow.findAll({
      where: {
        followerId: currentUserId,
      },
      attributes: ["followingId"],
    });

    const followingIds = following.map((item) => item.followingId);

    // No following users
    if (followingIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        activities: [],
      });
    }

    // Get recipes created by followed users
    const recipes = await Recipe.findAll({
      where: {
        UserId: {
          [Op.in]: followingIds,
        },
      },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "profileImage"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 30,
    });

    // Get reviews created by followed users
    const reviews = await Review.findAll({
      where: {
        UserId: {
          [Op.in]: followingIds,
        },
      },
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["id", "name", "profileImage"],
        },
        {
          model: Recipe,
          as: "recipe",
          attributes: ["id", "title", "description", "image"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 30,
    });

    // Convert recipes into feed activities
    const recipeActivities = recipes.map((recipe) => ({
      id: `recipe-${recipe.id}`,
      type: "RECIPE_CREATED",
      createdAt: recipe.createdAt,

      user: recipe.author,

      recipe: recipe,

      review: null,
    }));

    // Convert reviews into feed activities
    const reviewActivities = reviews.map((review) => ({
      id: `review-${review.id}`,
      type: "REVIEW_CREATED",
      createdAt: review.createdAt,

      user: review.reviewer,

      recipe: review.recipe,

      review: review,
    }));

    // Combine recipes + reviews
    const activities = [...recipeActivities, ...reviewActivities];

    // Latest activity first
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Return only latest 30 activities
    const latestActivities = activities.slice(0, 30);

    return res.status(200).json({
      success: true,
      count: latestActivities.length,
      activities: latestActivities,
    });
  } catch (error) {
    console.error("Activity feed error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch activity feed",
      error: error.message,
    });
  }
};

module.exports = {
  getActivityFeed,
};
