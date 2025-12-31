const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const sendEmail = require("../utils/sendEmail.js");

// Send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "Email not found!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.otp = hashedOTP;
    user.otpExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail(user.email, "Password Reset OTP", `Your OTP: ${otp}`);
    console.log("OTP:", otp);

    res.json({ success: true, message: "OTP sent to email!" });

  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      email,
      otp: hashedOTP,
      otpExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP!" });

    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({ success: true, message: "OTP Verified" });

  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.json({ success: true, message: "Password successfully updated!" });

  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
};
