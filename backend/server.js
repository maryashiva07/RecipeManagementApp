require("dotenv").config();

const app = require("./app");

const sequelize = require("./config/database");

// Import models
require("./models");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("MySQL database connected successfully");

    await sequelize.sync();

    console.log("All models synchronized successfully");

    app.listen(PORT, () => {
      console.log(`Server running on PORT:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);

    process.exit(1);
  }
};

startServer();
