const User = require("../models/user");
const JWT = require("jsonwebtoken");
const catchAsynceroors = require("./catchAsynceroors");
const ErrorHandler = require("../utils/errorHandler");

//check if user is authenticated or not

exports.isAuthenticatedUser = catchAsynceroors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login First to access this resource", 401));
  }

  const decoded = JWT.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role(${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
