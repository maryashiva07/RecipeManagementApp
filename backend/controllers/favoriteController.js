const { Favorite, Recipe } = require("../models");

// ADD FAVORITE

const addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    const existingFavorite = await Favorite.findOne({
      where: {
        UserId: req.user.id,
        RecipeId: recipeId,
      },
    });

    if (existingFavorite) {
      return res.status(409).json({
        success: false,
        message: "Recipe already in favorites",
      });
    }

    const favorite = await Favorite.create({
      UserId: req.user.id,

      RecipeId: recipeId,
    });

    res.status(201).json({
      success: true,

      message: "Recipe added to favorites",

      favorite,
    });
  } catch (error) {
    console.error("Add favorite error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add favorite",
    });
  }
};

// REMOVE FAVORITE

const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      where: {
        UserId: req.user.id,

        RecipeId: req.params.recipeId,
      },
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Recipe is not in your favorites",
      });
    }

    await favorite.destroy();

    res.status(200).json({
      success: true,

      message: "Recipe removed from favorites",
    });
  } catch (error) {
    console.error("Remove favorite error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove favorite",
    });
  }
};

// GET MY FAVORITES

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: {
        UserId: req.user.id,
      },

      include: [
        {
          model: Recipe,
          as: "Recipe",
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,

      count: favorites.length,

      favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
    });
  }
};

module.exports = {
  addFavorite,

  removeFavorite,

  getFavorites,
};
