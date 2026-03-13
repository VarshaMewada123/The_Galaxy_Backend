const express = require("express");
const router = express.Router();

const protect = require("../../middleware/adminAuth");
const orderAdminController = require("../../controllers/admin/orderAdminController");

router.get("/orders", protect, orderAdminController.getAllOrders);
router.patch(
  "/orders/:id/status",
  protect,
  orderAdminController.updateOrderStatus,
);
router.patch("/orders/:id/cancel", protect, orderAdminController.cancelOrder);

module.exports = router;
