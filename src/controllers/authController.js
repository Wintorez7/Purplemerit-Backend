const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register controller
const registerUser = async (req, res) => {
  try {
    //extract user infomration from our request body
    const { fullname, email, password, role } = req.body;

    // Basic field validation
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "fullname, email, and password are required.",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // if the user is already exist or not in database
    const CheckExistingUser = await User.findOne({email});
    if (CheckExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User Already Exist with this username or email! Please try with different email or username",
      });
    }
    // hash userpassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user save in database
    const NewlyCreatedUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await NewlyCreatedUser.save();
    if (NewlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User Register Succesfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to Register User! Please try again",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured! Please Try again Later",
    });
  }
};

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
