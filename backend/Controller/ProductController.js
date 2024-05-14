const Product = require("../models/products");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncerror = require("../middlewares/catchAsynceroors");
const APIFeatures = require("../utils/apifeatures");
//create new products => /api/v1/product/new
exports.newProduct = catchAsyncerror(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

exports.getProducts = catchAsyncerror(async (req, res, next) => {
  const resPerPage = 4;
  const productsCount = await Product.countDocuments();
  const apifeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const products = await apifeatures.query;

  res.status(200).json({
    success: true,
    products,
    resPerPage,
    productsCount,
  });
});
//get single product details => /api/v1/product/:id

exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not found!", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
};

//update product => /API/v1/product/:id
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not found!", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
};

exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not found!", 404));
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "product is deleted",
  });
};

// Create new review => /api/v1/review
exports.createProductReview = catchAsyncerror(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === re1.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.review.length;

  await product.save({ validatebeforesave: false });
  res.status(200).json({
    success: true,
  });
});
// Get Product Reviews => /api/v1/reviews
exports.getProductReviews = catchAsyncerror(async (req, res, next) => {
  const product = await Product.findById(req.body.id);
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
//Delete Product Review => /api/v1/review
exports.deleteReview = catchAsyncerror(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  const reviews = product.reviews.filter(
    review._id.toString() !== req.user.id.toString()
  );
  const numOfReviews = reviews.length;
  const rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.review.length;

  await Product.findById(
    req.query.id,
    { reviews, ratings, numOfReviews },
    {
      new: true,
      runValidators: true,
      userFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
