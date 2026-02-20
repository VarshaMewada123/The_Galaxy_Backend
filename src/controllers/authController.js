const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateOTP, hashOTP } = require("../utils/otp");
const { sendOTP } = require("../services/smsService");

exports.sendOtp = async (req, res) => {
  try {
    const { fullName, phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      if (!fullName) {
        return res.status(400).json({ message: "Full name required" });
      }

      user = await User.create({ fullName, phone });
    }

    const otp = generateOTP();
    const hashedOtp = hashOTP(otp);

    user.otp = hashedOtp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOTP(phone, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone & OTP required" });
    }

    const user = await User.findOne({ phone }).select("+otp +otpExpiresAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedOtp = hashOTP(otp);

    if (hashedOtp !== user.otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
