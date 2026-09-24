const { User, Recipe, Favorite } = require("../models");

// GET MY PROFILE

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password"],
      },

      include: [
        {
          model: Recipe,
          as: "recipes",
        },

        {
          model: Favorite,
          as: "favorites",

          include: [
            {
              model: Recipe,
              as: "Recipe",
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// UPDATE PROFILE

const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, bio } = req.body;

    if (name !== undefined) {
      user.name = name;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();

    res.status(200).json({
      success: true,

      message: "Profile updated successfully",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// GET USER BY ID

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "bio", "profileImage", "createdAt"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// GET USER'S RECIPES

const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      where: {
        UserId: req.params.id,
      },

      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,

      count: recipes.length,

      recipes,
    });
  } catch (error) {
    console.error("Get user recipes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user recipes",
    });
  }
};

// GET MY FAVORITES

const getMyFavorites = async (req, res) => {
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
  getMyProfile,
  updateProfile,
  getUserById,
  getUserRecipes,
  getMyFavorites,
};
