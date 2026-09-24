const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR:", err);

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "File size must be less than 5MB",
    });
  }

  // Multer / file validation error
  if (err.message === "Only JPG, JPEG, PNG and WEBP images are allowed") {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorMiddleware;
