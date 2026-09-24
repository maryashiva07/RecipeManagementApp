const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Profile images folder
const profilePath = path.join(__dirname, "../uploads/profiles");

// Recipe images folder
const recipePath = path.join(__dirname, "../uploads/recipes");

// Create folders if they don't exist
if (!fs.existsSync(profilePath)) {
  fs.mkdirSync(profilePath, { recursive: true });
}

if (!fs.existsSync(recipePath)) {
  fs.mkdirSync(recipePath, { recursive: true });
}

// Generate unique filename
const generateFileName = (file) => {
  const extension = path.extname(file.originalname);

  return `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
};

// Profile storage
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePath);
  },

  filename: (req, file, cb) => {
    cb(null, generateFileName(file));
  },
});

// Recipe storage
const recipeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, recipePath);
  },

  filename: (req, file, cb) => {
    cb(null, generateFileName(file));
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"), false);
  }
};

// Profile upload
const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Recipe upload
const uploadRecipe = multer({
  storage: recipeStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadProfile,
  uploadRecipe,
};
