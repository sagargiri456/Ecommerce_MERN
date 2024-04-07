const Product = require("../models/products");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

const products = require("../data/products.json");

//setting dotenv
dotenv.config({ path: "../config/config.env" });
connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany({});
    console.log("products are deleted");

    await Product.insertMany(product);
    console.log("products are added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
