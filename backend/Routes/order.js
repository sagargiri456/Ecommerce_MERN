const express = require("express");
const router = express.Router();

const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
} = require("../Controller/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/order/new").post(isAuthenticatedUser);
router.route("/order/:id").get(isAutheticateUser, getSingleOrder);
router.route("/order/me").get(isAutheticateUser, myOrders);
router
  .route("/admin/orders")
  .get(isAutheticateUser, authorizeRoles("admin"), allOrders);
router
  .route("/admin/orders/:id")
  .get(isAutheticateUser, authorizeRoles("admin"), updateOrder);
router
  .route("/admin/orders/:id")
  .put(isAutheticateUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);
module.exports = router;
