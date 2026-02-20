const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      select: false,
    },

    otpExpiresAt: {
      type: Date,
      select: false,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
