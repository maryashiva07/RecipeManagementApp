const { User, Follow, Recipe } = require("../models");

// FOLLOW USER

const followUser = async (req, res) => {
  try {
    const followingId = Number(req.params.userId);

    if (followingId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const user = await User.findByPk(followingId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingFollow = await Follow.findOne({
      where: {
        followerId: req.user.id,

        followingId,
      },
    });

    if (existingFollow) {
      return res.status(409).json({
        success: false,
        message: "You are already following this user",
      });
    }

    const follow = await Follow.create({
      followerId: req.user.id,

      followingId,
    });

    res.status(201).json({
      success: true,

      message: "User followed successfully",

      follow,
    });
  } catch (error) {
    console.error("Follow error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to follow user",
    });
  }
};

// UNFOLLOW USER

const unfollowUser = async (req, res) => {
  try {
    const follow = await Follow.findOne({
      where: {
        followerId: req.user.id,

        followingId: req.params.userId,
      },
    });

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: "You are not following this user",
      });
    }

    await follow.destroy();

    res.status(200).json({
      success: true,

      message: "User unfollowed successfully",
    });
  } catch (error) {
    console.error("Unfollow error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to unfollow user",
    });
  }
};

// GET FOLLOWERS

const getFollowers = async (req, res) => {
  try {
    const followers = await Follow.findAll({
      where: {
        followingId: req.params.userId,
      },

      include: [
        {
          model: User,
          as: "follower",
          attributes: ["id", "name", "bio", "profileImage"],
        },
      ],
    });

    res.status(200).json({
      success: true,

      count: followers.length,

      followers,
    });
  } catch (error) {
    console.error("Get followers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch followers",
    });
  }
};

// GET FOLLOWING

const getFollowing = async (req, res) => {
  try {
    const following = await Follow.findAll({
      where: {
        followerId: req.params.userId,
      },

      include: [
        {
          model: User,
          as: "following",
          attributes: ["id", "name", "bio", "profileImage"],
        },
      ],
    });

    res.status(200).json({
      success: true,

      count: following.length,

      following,
    });
  } catch (error) {
    console.error("Get following error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch following users",
    });
  }
};

module.exports = {
  followUser,

  unfollowUser,

  getFollowers,

  getFollowing,
};
