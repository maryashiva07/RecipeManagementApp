const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Favorite = require("../models/Favorite");
const Collection = require("../models/Collection");
const CollectionRecipe = require("../models/collectionRecipe");
const Review = require("../models/Review");
const Follow = require("../models/Follow");
const Activity = require("../models/Activity");

// USER → RECIPE

User.hasMany(Recipe, {
  foreignKey: "UserId",
  as: "recipes",
});

Recipe.belongsTo(User, {
  foreignKey: "UserId",
  as: "author",
});

// USER → FAVORITES

User.hasMany(Favorite, {
  foreignKey: "UserId",
  as: "favorites",
});

Favorite.belongsTo(User, {
  foreignKey: "UserId",
  as: "user",
});

// RECIPE → FAVORITES

Recipe.hasMany(Favorite, {
  foreignKey: "RecipeId",
  as: "favorites",
});

Favorite.belongsTo(Recipe, {
  foreignKey: "RecipeId",
  as: "Recipe",
});

// USER → COLLECTION

User.hasMany(Collection, {
  foreignKey: "UserId",
  as: "collections",
});

Collection.belongsTo(User, {
  foreignKey: "UserId",
  as: "owner",
});

// COLLECTION ↔ RECIPE

Collection.belongsToMany(Recipe, {
  through: CollectionRecipe,
  as: "recipes",
  foreignKey: "CollectionId",
});

Recipe.belongsToMany(Collection, {
  through: CollectionRecipe,
  as: "collections",
  foreignKey: "RecipeId",
});

// USER → REVIEW

User.hasMany(Review, {
  foreignKey: "UserId",
  as: "reviews",
});

Review.belongsTo(User, {
  foreignKey: "UserId",
  as: "reviewer",
});

// RECIPE → REVIEW

Recipe.hasMany(Review, {
  foreignKey: "RecipeId",
  as: "reviews",
});

Review.belongsTo(Recipe, {
  foreignKey: "RecipeId",
  as: "recipe",
});

// FOLLOW SYSTEM

User.hasMany(Follow, {
  foreignKey: "followerId",
  as: "following",
});

User.hasMany(Follow, {
  foreignKey: "followingId",
  as: "followers",
});

Follow.belongsTo(User, {
  foreignKey: "followerId",
  as: "follower",
});

Follow.belongsTo(User, {
  foreignKey: "followingId",
  as: "following",
});

// ACTIVITY → USER

User.hasMany(Activity, {
  foreignKey: "UserId",
  as: "activities",
});

Activity.belongsTo(User, {
  foreignKey: "UserId",
  as: "user",
});

// ACTIVITY → RECIPE

Activity.belongsTo(Recipe, {
  foreignKey: "recipeId",
  as: "recipe",
});

Recipe.hasMany(Activity, {
  foreignKey: "recipeId",
  as: "activities",
});

// ACTIVITY → REVIEW

Activity.belongsTo(Review, {
  foreignKey: "reviewId",
  as: "review",
});

Review.hasMany(Activity, {
  foreignKey: "reviewId",
  as: "activities",
});

module.exports = {
  User,
  Recipe,
  Favorite,
  Collection,
  CollectionRecipe,
  Review,
  Follow,
  Activity,
};
