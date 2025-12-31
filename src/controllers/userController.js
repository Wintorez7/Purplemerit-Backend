const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.log("Change Password Error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const updateProfile = async (req, res) => {
  const { fullname, email } = req.body;

  try {
    await User.findByIdAndUpdate(req.user._id, { fullname, email });

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { role: "user" }; // filter only "user" role

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    res.json({ users, totalPages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = { changePassword, updateProfile ,getAllUsers};