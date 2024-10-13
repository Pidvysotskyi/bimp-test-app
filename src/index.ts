import app from "./app";
import sequelize from "./db";
import "dotenv/config";

const { APP_PORT } = process.env;

const start = async () => {
  try {
    // Connect to DB
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Synchronize the DB tables

    await sequelize.sync({ force: true });
    console.log("The data base is synchronized");

    // Start the server

    await app.listen({ port: Number(APP_PORT), host: "0.0.0.0" });
    console.log(`Server is running on http://localhost:${APP_PORT}}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
