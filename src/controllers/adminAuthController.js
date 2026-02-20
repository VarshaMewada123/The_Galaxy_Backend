const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { AppError } = require("../middleware/errorHandler");

/**
 * Generate Access Token
 */
const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_ACCESS_SECRET,
    // {
    //   expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    // }
  );
};

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (admin) => {
  return jwt.sign({ id: admin._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

/**
 * Admin Login
 */
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin || !admin.isActive) {
      return next(new AppError("Invalid email or password", 401));
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return next(new AppError("Invalid email or password", 401));
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    /**
     * Secure Cookie Options
     */
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    // Access Token Cookie
    res.cookie("adminAccessToken", accessToken, {
      ...cookieOptions,
      // maxAge: 60 * 60 * 1000, // 15 minutes
    });

    // Refresh Token Cookie
    res.cookie("adminRefreshToken", refreshToken, {
      ...cookieOptions,
      // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    return next(new AppError("Admin login failed", 500));
  }
};

/**
 * Get Current Admin (Protected Route)
 */
exports.getCurrentAdmin = async (req, res, next) => {
  try {
    if (!req.admin) {
      return next(new AppError("Unauthorized", 401));
    }

    return res.status(200).json({
      success: true,
      admin: req.admin,
    });
  } catch (err) {
    return next(new AppError("Failed to fetch admin", 500));
  }
};

/**
 * Admin Logout
 */
exports.adminLogout = async (req, res, next) => {
  try {
    res.clearCookie("adminAccessToken");
    res.clearCookie("adminRefreshToken");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    return next(new AppError("Logout failed", 500));
  }
};

// exports.AdminLogout = async (req, res) => {
//   try {
//     res.clearCookie("accessToken", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "stactic",
//       path: "/",
//     });
//     res.clearCookie("refreshToken", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Logged out successfully",
//     });
//   } catch (error) {
//     console.error("Error", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       success: false,
//     });
//   }
// };
