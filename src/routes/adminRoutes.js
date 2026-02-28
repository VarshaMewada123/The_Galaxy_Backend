const express = require("express");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");

const {
  adminLogin,
  adminLogout,
  getCurrentAdmin,
} = require("../controllers/adminAuthController");
const adminAuth = require("../middleware/adminAuth");
const validate = require("../middleware/validate");

const router = express.Router();

// const loginLimiter = rateLimit({
//   windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
//   max: 5,
//   standardHeaders: true,
//   legacyHeaders: false,
//   // 👇 ADD THIS SKIP FUNCTION
//   skip: (req) => req.method === 'OPTIONS', 
//   message: {
//     success: false,
//     message: "Too many login attempts. Please try again later.",
//   },
// });

router.post(
  "/login",
  
  [
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("password")
      .isString()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  validate,
  adminLogin,
);

router.get("/me", adminAuth, getCurrentAdmin);

router.post("/logout", adminAuth, adminLogout);

module.exports = router;
