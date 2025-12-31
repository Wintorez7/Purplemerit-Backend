const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    // 🔹 Basic field validation
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "fullname, email, and password are required.",
      });
    }

    // 🔹 Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // 🔹 Password strength validation
    // Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, uppercase, lowercase, number & special character.",
      });
    }

    // 🔹 Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please login.",
      });
    }

    // 🔹 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Create new user in DB
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // 🔹 Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔹 Return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = { registerUser };


// login controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find if current user is exist in databas or not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credential",
      });
    }

    if (user.status === "inactive")
      return res.status(403).json({ message: "Account is deactivated. Contact admin." });

    // if password is correct or not
    const isPasswordisMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordisMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credential",
      });
    }

    // create user token
    const accessToken = jwt.sign(
      {
        id: user._id,
        fullname: user.fullname,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successfull",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured! Please Try again Later",
    });
  }
};

const getMe = (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser ,getMe};
