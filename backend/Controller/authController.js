const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncerrors = require("../middlewares/catchAsynceroors");
const sendToken = require("../utils/jwtTokens");
const crypto = require("crypto");

//Register a User => /api/v1/register
exports.registerUser = catchAsyncerrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "this is a sample url",
    },
  });

  sendToken(user, 200, res);
});

exports.loginUser = catchAsyncerrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // Finding user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Email or Password is Wrong", 401));
  }

  // Checks if password is correct or not
  //const isPasswordMatched = await user.comparePassword(password);
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Email or Password", 401));
  }

  sendToken(user, 200, res);
  // const token = user.getJwtToken();
  // res.status(200).json({
  //   success: true,
  //   token,
  // });
});

exports.Logout = catchAsyncerrors(async (req, res, next) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//Forgot Passwrod => /api/v1/password/forgot
exports.forgotPassword = catchAsyncerrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("user not found with this email", 404));
  }

  //Get reset token
  const resetToken = User.getResetPasswordToken();
  await user.save({ validatorBeforeSave: false });

  //create user password url

  const resetUrl = `${req.protocol}:${req.get(
    "host"
  )}/api/v1/reset/${resetToken}`;
  const message = `Your Password reset token is as follows : \n\n${resetUrl}\n\n. If you have not requested this email just ignore it.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIt Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.getResetPasswordToken = undefined;
    user.getResetPasswordExpire = undefined;
    await user.save({ validatorBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});
//Forgot Password => /api/v1/password/reset/:token

exports.resetPassword = catchAsyncerrors(async (req, res, next) => {
  //Hash URL token
  const getResetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await user.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("Password reset token invalid or has been expired", 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  //setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

//Get currently logged in user detail =/api/v1/me

exports.getUserProfile = catchAsyncerrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//Update or change password => /api/v1/password/update

exports.updatePassword = catchAsyncerrors(async (req, res, next) => {
  const user = await User.findById(req.body.id).select("+password");

  //check previous user password
  const isMatched = await User.comparePassword(req.body.oldPassword);

  if (!isMatched) {
    return next(new ErrorHandler("old Password is incorrect"));
  }
  user.password = req.body.password;

  await user.save();
  sendToken(user, 200, res);
});

//Update user profile => /api/v1/me/update

exports.updateProfile = catchAsyncerrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  //update avatar:TODO
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

//Admin Routes

//Get all Users => /api/v1/admin/users

exports.allUsers = catchAsyncerrors(async (req, res, next) => {
  const users = await user.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//Get User details => /api/v1/admin/user/:id

exports.getUserDetails = catchAsyncerrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with this id:${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//Update user profile => /api/v1/admin/user/:id

exports.updateUser = catchAsyncerrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  //update avatar:TODO
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

//Delete => /api/v1/admin/user/:id

exports.deleteUser = catchAsyncerrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with this id:${req.params.id}`)
    );
  }

  //Remove avatar from cloudinary -TODO

  await user.remove();

  res.status(200).json({
    success: true,
    user,
  });
});
