const express = require("express");
const router = express.Router();

console.log("Loading Orders Routes...");

const orderController = require("../../controllers/orders/ordersController");
const protect = require("../../middleware/auth");

console.log("Controller loaded:", orderController);
console.log("Protect middleware:", protect);

router.post("/", protect, (req, res, next) => {
  console.log("POST /orders called");
  orderController.createOrder(req, res, next);
});

router.get("/", protect, (req, res, next) => {
  console.log("GET /orders called");
  orderController.getMyOrders(req, res, next);
});

module.exports = router;
