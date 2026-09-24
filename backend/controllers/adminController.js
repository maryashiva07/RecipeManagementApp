const { User, Recipe } = require("../models");

// GET ALL USERS

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },

      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,

      count: users.length,

      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// BAN USER

const banUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot ban yourself",
      });
    }

    user.status = "BANNED";

    await user.save();

    res.status(200).json({
      success: true,

      message: "User banned successfully",
    });
  } catch (error) {
    console.error("Ban user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to ban user",
    });
  }
};

// APPROVE USER

const approveUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.status = "ACTIVE";

    await user.save();

    res.status(200).json({
      success: true,

      message: "User approved successfully",
    });
  } catch (error) {
    console.error("Approve user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to approve user",
    });
  }
};

// DELETE USER

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete yourself",
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,

      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// GET ALL RECIPES - ADMIN

const getAllRecipesAdmin = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,

      count: recipes.length,

      recipes,
    });
  } catch (error) {
    console.error("Admin recipes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recipes",
    });
  }
};

// DELETE RECIPE - ADMIN

const deleteRecipeAdmin = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    await recipe.destroy();

    res.status(200).json({
      success: true,

      message: "Recipe removed by admin",
    });
  } catch (error) {
    console.error("Admin delete recipe error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete recipe",
    });
  }
};

module.exports = {
  getAllUsers,

  banUser,

  approveUser,

  deleteUser,

  getAllRecipesAdmin,

  deleteRecipeAdmin,
};
