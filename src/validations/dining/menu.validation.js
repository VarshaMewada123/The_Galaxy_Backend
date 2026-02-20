const { body, param } = require("express-validator");

exports.createMenuValidation = [
  body("name").notEmpty().withMessage("Menu name is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("basePrice")
    .notEmpty()
    .withMessage("Base price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be positive"),

  body("taxPercent")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Tax must be positive"),

  body("isVeg")
    .optional()
    .isBoolean()
    .withMessage("isVeg must be boolean"),

  body("preparationTime")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Preparation time must be at least 1 minute"),
];

exports.updateMenuValidation = [
  param("id").isMongoId().withMessage("Invalid menu ID"),
];
