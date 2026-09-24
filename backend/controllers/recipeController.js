const { Op } = require("sequelize");

const { Recipe, User, Review } = require("../models");

// CREATE RECIPE

const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookingTime,
      servings,
      difficulty,
      category,
      dietaryType,
    } = req.body;

    if (
      !title ||
      !description ||
      !ingredients ||
      !instructions ||
      !prepTime ||
      !cookingTime ||
      !servings ||
      !difficulty ||
      !category ||
      !dietaryType
    ) {
      return res.status(400).json({
        success: false,
        message: "All recipe fields are required",
      });
    }

    let parsedIngredients = ingredients;
    let parsedInstructions = instructions;

    // When sent using multipart/form-data,
    // JSON values come as strings.

    if (typeof ingredients === "string") {
      try {
        parsedIngredients = JSON.parse(ingredients);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid ingredients JSON",
        });
      }
    }

    if (typeof instructions === "string") {
      try {
        parsedInstructions = JSON.parse(instructions);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid instructions JSON",
        });
      }
    }

    // Local image path

    let image = null;

    if (req.file) {
      image = `/uploads/recipes/${req.file.filename}`;
    }

    const recipe = await Recipe.create({
      UserId: req.user.id,

      title,

      description,

      ingredients: parsedIngredients,

      instructions: parsedInstructions,

      prepTime,

      cookingTime,

      servings,

      difficulty,

      category,

      dietaryType,

      image,
    });

    res.status(201).json({
      success: true,

      message: "Recipe created successfully",

      recipe,
    });
  } catch (error) {
    console.error("Create recipe error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create recipe",
    });
  }
};

// GET ALL RECIPES

const getAllRecipes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      dietaryType,
      difficulty,
      maxPrepTime,
      maxCookingTime,
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const where = {};

    // Search title / description / category

    if (search) {
      where[Op.or] = [
        {
          title: {
            [Op.like]: `%${search}%`,
          },
        },

        {
          description: {
            [Op.like]: `%${search}%`,
          },
        },

        {
          category: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    // Category

    if (category) {
      where.category = category;
    }

    // Dietary filter

    if (dietaryType) {
      where.dietaryType = dietaryType;
    }

    // Difficulty

    if (difficulty) {
      where.difficulty = difficulty;
    }

    // Preparation time

    if (maxPrepTime) {
      where.prepTime = {
        [Op.lte]: Number(maxPrepTime),
      };
    }

    // Cooking time

    if (maxCookingTime) {
      where.cookingTime = {
        [Op.lte]: Number(maxCookingTime),
      };
    }

    const result = await Recipe.findAndCountAll({
      where,

      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "profileImage"],
        },
      ],

      limit: Number(limit),

      offset,

      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,

      recipes: result.rows,

      pagination: {
        currentPage: Number(page),

        totalRecipes: result.count,

        totalPages: Math.ceil(result.count / Number(limit)),

        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Get recipes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recipes",
    });
  }
};

// GET SINGLE RECIPE

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "bio", "profileImage"],
        },

        {
          model: Review,
          as: "reviews",

          include: [
            {
              model: User,
              as: "reviewer",
              attributes: ["id", "name", "profileImage"],
            },
          ],
        },
      ],
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,

      recipe,
    });
  } catch (error) {
    console.error("Get recipe error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recipe",
    });
  }
};

// UPDATE RECIPE

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Only owner can edit

    if (recipe.UserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own recipes",
      });
    }

    const fields = [
      "title",
      "description",
      "prepTime",
      "cookingTime",
      "servings",
      "difficulty",
      "category",
      "dietaryType",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        recipe[field] = req.body[field];
      }
    });

    if (req.body.ingredients) {
      recipe.ingredients =
        typeof req.body.ingredients === "string"
          ? JSON.parse(req.body.ingredients)
          : req.body.ingredients;
    }

    if (req.body.instructions) {
      recipe.instructions =
        typeof req.body.instructions === "string"
          ? JSON.parse(req.body.instructions)
          : req.body.instructions;
    }

    if (req.file) {
      recipe.image = `/uploads/recipes/${req.file.filename}`;
    }

    await recipe.save();

    res.status(200).json({
      success: true,

      message: "Recipe updated successfully",

      recipe,
    });
  } catch (error) {
    console.error("Update recipe error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update recipe",
    });
  }
};

// DELETE RECIPE

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Owner or admin

    if (recipe.UserId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this recipe",
      });
    }

    await recipe.destroy();

    res.status(200).json({
      success: true,

      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error("Delete recipe error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete recipe",
    });
  }
};

module.exports = {
  createRecipe,

  getAllRecipes,

  getRecipeById,

  updateRecipe,

  deleteRecipe,
};
