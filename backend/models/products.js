const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the product name"],
    trim: true,
    maxLength: [100, "product name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [5, "product nae cannot exceed 5 characters"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [100, "please enter the product description"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  cateogory: {
    type: String,
    required: [true, "Plese enter the cateogory of the product"],
    enum: {
      values: [
        "Electronics",
        "cameras",
        "shoes",
        "smartphones",
        "Laptops",
        "Food",
        "Books",
      ],
      message: "please select the correct cateogory for your product.",
    },
  },
  seller: {
    type: String,
    required: [true, "please enter the product seller name"],
  },
  stock: {
    type: Number,
    required: [true, "please enter the product name"],
    maxLength: [5, "product name cannot exceed 5 character"],
    default: 0,
  },
  numofReview: {
    type: Number,
    default: 0,
  },
  review: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
