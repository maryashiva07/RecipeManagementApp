const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Collection = sequelize.define(
  "Collection",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "collections",
    timestamps: true,
  },
);

module.exports = Collection;
