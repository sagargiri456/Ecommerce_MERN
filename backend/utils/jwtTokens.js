const user = require("../models/user");
const getJwtToken = require("../models/user");

const sendToken = (user, statusCode, res) => {
  //create JWT token
  const token = user.getJwtToken();

  //options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
