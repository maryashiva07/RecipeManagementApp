const bcrypt = require("bcrypt");

const { User } = require("../models");

const generateToken = require("../utils/generateToken");

// REGISTER

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check existing user

    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user

    const user = await User.create({
      name,

      email,

      password: hashedPassword,
    });

    res.status(201).json({
      success: true,

      message: "User registered successfully",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
};

// LOGIN

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check account status

    if (user.status === "BANNED") {
      return res.status(403).json({
        success: false,
        message: "Your account has been banned",
      });
    }

    if (user.status === "PENDING") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval",
      });
    }

    // Compare password

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT

    const token = generateToken(user);

    res.status(200).json({
      success: true,

      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
