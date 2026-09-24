const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Activity = sequelize.define(
  "Activity",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    type: {
      type: DataTypes.ENUM(
        "RECIPE_CREATED",
        "REVIEW_CREATED",
        "RECIPE_FAVORITED",
      ),
      allowNull: false,
    },

    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "activities",
    timestamps: true,
  },
);

module.exports = Activity;
