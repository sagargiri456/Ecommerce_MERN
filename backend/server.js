const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//config:
dotenv.config({ path: "./config/config.env" });

//connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is working on https://localhost:${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
//Handle unhandled promise rejection.
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down the server.");
  server.close(() => {
    process.exit(1);
  });
});
