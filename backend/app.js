const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Middlewares

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cors());

// Static Files

// Uploaded images access karne ke liye
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const followRoutes = require("./routes/followRoutes");
const feedRoutes = require("./routes/feedRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { swaggerSpec, swaggerUi } = require("./docs/swagger");

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/recipes", recipeRoutes);

app.use("/api/favorites", favoriteRoutes);

app.use("/api/collections", collectionRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/follows", followRoutes);

app.use("/api/feed", feedRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Recipe Management API is running",
  });
});

// 404 Route

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Middleware

const errorMiddleware = require("./middleware/errorMiddleware");

app.use(errorMiddleware);

module.exports = app;
