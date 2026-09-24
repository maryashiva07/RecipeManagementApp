const { Collection, Recipe } = require("../models");

// CREATE COLLECTION

const createCollection = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Collection name is required",
      });
    }

    const collection = await Collection.create({
      name,

      description,

      UserId: req.user.id,
    });

    res.status(201).json({
      success: true,

      message: "Collection created successfully",

      collection,
    });
  } catch (error) {
    console.error("Create collection error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create collection",
    });
  }
};

// GET MY COLLECTIONS

const getCollections = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: {
        UserId: req.user.id,
      },

      include: [
        {
          model: Recipe,
          as: "recipes",
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,

      collections,
    });
  } catch (error) {
    console.error("Get collections error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch collections",
    });
  }
};

// GET SINGLE COLLECTION

const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      where: {
        id: req.params.id,

        UserId: req.user.id,
      },

      include: [
        {
          model: Recipe,
          as: "recipes",
        },
      ],
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,

      collection,
    });
  } catch (error) {
    console.error("Get collection error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch collection",
    });
  }
};

// UPDATE COLLECTION

const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      where: {
        id: req.params.id,

        UserId: req.user.id,
      },
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    const { name, description } = req.body;

    if (name !== undefined) {
      collection.name = name;
    }

    if (description !== undefined) {
      collection.description = description;
    }

    await collection.save();

    res.status(200).json({
      success: true,

      message: "Collection updated successfully",

      collection,
    });
  } catch (error) {
    console.error("Update collection error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update collection",
    });
  }
};

// DELETE COLLECTION

const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      where: {
        id: req.params.id,

        UserId: req.user.id,
      },
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    await collection.destroy();

    res.status(200).json({
      success: true,

      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.error("Delete collection error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete collection",
    });
  }
};

// ADD RECIPE TO COLLECTION

const addRecipeToCollection = async (req, res) => {
  try {
    const { collectionId, recipeId } = req.params;

    const collection = await Collection.findOne({
      where: {
        id: collectionId,

        UserId: req.user.id,
      },
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    await collection.addRecipe(recipe);

    res.status(200).json({
      success: true,

      message: "Recipe added to collection",
    });
  } catch (error) {
    console.error("Add recipe collection error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add recipe",
    });
  }
};

// REMOVE RECIPE FROM COLLECTION

const removeRecipeFromCollection = async (req, res) => {
  try {
    const { collectionId, recipeId } = req.params;

    const collection = await Collection.findOne({
      where: {
        id: collectionId,

        UserId: req.user.id,
      },
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    await collection.removeRecipe(recipeId);

    res.status(200).json({
      success: true,

      message: "Recipe removed from collection",
    });
  } catch (error) {
    console.error("Remove recipe collection error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove recipe",
    });
  }
};

module.exports = {
  createCollection,

  getCollections,

  getCollectionById,

  updateCollection,

  deleteCollection,

  addRecipeToCollection,

  removeRecipeFromCollection,
};
