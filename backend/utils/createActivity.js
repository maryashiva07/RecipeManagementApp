const { Activity } = require("../models");

const createActivity = async ({
  userId,
  type,
  recipeId = null,
  reviewId = null,
}) => {
  try {
    const activity = await Activity.create({
      UserId: userId,
      type,
      recipeId,
      reviewId,
    });

    return activity;
  } catch (error) {
    console.error("Create Activity Error:", error.message);

    return null;
  }
};

module.exports = createActivity;
