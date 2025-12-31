const express = require('express')
const router = express.Router()
const {registerUser,loginUser,getMe} = require('../controllers/authController.js')
const authMiddleware = require("../middleware/auth-Middleware.js");

// all routes are related to authentication and authorization
router.post('/register',registerUser)
router.post('/login',loginUser)
router.get("/me", authMiddleware, getMe);



module.exports = router