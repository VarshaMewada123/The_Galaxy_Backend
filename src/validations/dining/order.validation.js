const { body } = require("express-validator");

exports.createOrderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),

  body("items.*.menuItemId").isMongoId().withMessage("Invalid menu item ID"),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("paymentMethod")
    .optional()
    .isIn(["CASH", "UPI", "ONLINE"])
    .withMessage("Invalid payment method"),

  body("deliveryType")
    .optional()
    .isIn(["ROOM", "TABLE", "TAKEAWAY"])
    .withMessage("Invalid delivery type"),
];
