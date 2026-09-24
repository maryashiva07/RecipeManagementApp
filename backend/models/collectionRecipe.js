const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CollectionRecipe = sequelize.define(
  "CollectionRecipe",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: "collection_recipes",
    timestamps: true,
  },
);

module.exports = CollectionRecipe;
