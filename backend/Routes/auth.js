const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  Logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  updateUser,
  getUserDetails,
  deleteUser,
} = require("../Controller/authController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(Logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/update").put(updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(getUserProfile, isAuthenticatedUser);
router
  .route("/admin/users")
  .get(allUsers, authorizeRoles("admin"), isAuthenticatedUser);
router
  .route("/admin/users/:id")
  .get(getUserDetail, authorizeRoles("admin"), isAuthenticatedUser)
  .put(updateUser, authorizeRoles("admin"), isAuthenticatedUser)
  .delete(deleteUser, authorizeRoles("admin"), isAuthenticatedUser);

module.exports = router;
