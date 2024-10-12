import app from "./app";
import sequelize from "./db";

const start = async () => {
  try {
    // Connect to DB
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Synchronize the DB tables

    await sequelize.sync({ force: true });
    console.log("The data base is synchronized");

    // Start the server

    await app.listen({ port: 10000 });
    console.log("Server is running on http://localhost:10000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
