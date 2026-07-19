require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    // Creates tables if they don't exist yet. For schema changes after the
    // first run, use a proper migration tool instead of relying on this.
    await sequelize.sync();
    console.log("Models synced.");

    app.listen(PORT, () => {
      console.log(`Hotelsys backend listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
