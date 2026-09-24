const { Review, Recipe, User, Activity } = require("../models");

// CREATE REVIEW

const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const recipe = await Recipe.findByPk(req.params.recipeId);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // One user -> one review per recipe

    const existingReview = await Review.findOne({
      where: {
        UserId: req.user.id,

        RecipeId: req.params.recipeId,
      },
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this recipe",
      });
    }

    const review = await Review.create({
      UserId: req.user.id,

      RecipeId: req.params.recipeId,

      rating: Number(rating),

      comment,
    });

    // Activity

    await Activity.create({
      UserId: req.user.id,

      type: "REVIEW_CREATED",

      recipeId: recipe.id,

      reviewId: review.id,
    });

    res.status(201).json({
      success: true,

      message: "Review added successfully",

      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create review",
    });
  }
};

// GET RECIPE REVIEWS

const getRecipeReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: {
        RecipeId: req.params.recipeId,
      },

      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["id", "name", "profileImage"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    const totalReviews = reviews.length;

    let averageRating = 0;

    if (totalReviews > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );

      averageRating = totalRating / totalReviews;
    }

    res.status(200).json({
      success: true,

      averageRating: Number(averageRating.toFixed(1)),

      totalReviews,

      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// UPDATE REVIEW

const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id,

        UserId: req.user.id,
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const { rating, comment } = req.body;

    if (rating !== undefined) {
      if (Number(rating) < 1 || Number(rating) > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      review.rating = Number(rating);
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    res.status(200).json({
      success: true,

      message: "Review updated successfully",

      review,
    });
  } catch (error) {
    console.error("Update review error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

// DELETE REVIEW

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id,

        UserId: req.user.id,
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await review.destroy();

    res.status(200).json({
      success: true,

      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

module.exports = {
  createReview,

  getRecipeReviews,

  updateReview,

  deleteReview,
};
