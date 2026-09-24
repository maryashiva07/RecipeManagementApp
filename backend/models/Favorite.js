const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Favorite = sequelize.define(
  "Favorite",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: "favorites",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["UserId", "RecipeId"],
      },
    ],
  },
);

module.exports = Favorite;
