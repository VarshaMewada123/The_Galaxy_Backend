const { body, param } = require("express-validator");

exports.createCategoryValidation = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ max: 100 })
    .withMessage("Category name cannot exceed 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("image").optional().isURL().withMessage("Image must be a valid URL"),

  body("sortOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sort order must be a positive integer"),
];

exports.updateCategoryValidation = [
  param("id").isMongoId().withMessage("Invalid category ID"),
];
