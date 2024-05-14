const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectDatabase = () => {
  mongoose
    .connect("mongodb://localhost:27017/ecommerce")
    .then((con) => {
      console.log(
        `MongoDB Database connected with HOST: ${con.connection.host}`
      );
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};
module.exports = connectDatabase;
