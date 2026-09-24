const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Recipe = sequelize.define(
  "Recipe",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    ingredients: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    instructions: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    prepTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cookingTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    servings: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    difficulty: {
      type: DataTypes.ENUM("EASY", "MEDIUM", "HARD"),
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    dietaryType: {
      type: DataTypes.ENUM(
        "VEGETARIAN",
        "VEGAN",
        "NON_VEGETARIAN",
        "GLUTEN_FREE",
      ),
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "recipes",
    timestamps: true,
  },
);

module.exports = Recipe;
