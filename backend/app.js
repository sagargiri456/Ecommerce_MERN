const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error");

app.use(express.json());
app.use(cookieParser());

//Importing all the routes.
const products = require("./Routes/product");
const auth = require("./Routes/auth");
const order = require;

app.use("/api/v1", products);
app.use("/api/v1", auth);

//Middlewares to handle error
app.use(errorMiddleware);

module.exports = app;
