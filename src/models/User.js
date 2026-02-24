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
      required: [true, "Phone number is required"],
      unique: true,
      index: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian mobile number"],
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    otp: {
      type: String,
      select: false,
    },

    otpExpiresAt: {
      type: Date,
      select: false,
      index: true,
    },

    otpLastRequestedAt: {
      type: Date,
      select: false,
    },

    otpRequestCount: {
      type: Number,
      default: 0,
      select: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  },
);

userSchema.index({ phone: 1 });

module.exports = mongoose.model("User", userSchema);
