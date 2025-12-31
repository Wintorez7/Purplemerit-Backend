
const { updateProfile, changePassword } = require("../controllers/userController");
const express = require("express");
const authMiddleware = require("../middleware/auth-Middleware");
const isNormalUser = require('../middleware/user-middleware')
const router = express.Router()


// Update profile route
router.put("/update-profile", authMiddleware, updateProfile);

// Change password route
router.put("/change-password", authMiddleware, changePassword);

router.get('/dashboard', authMiddleware,isNormalUser, (req, res) => {
    const { fullname, _id, role } = req.user;

    res.json({
        success: true,
        message: `Welcome ${fullname} to User Dashboard`,
        user: {
            _id,
            fullname,
            role,
        }
    });
});

module.exports = router;
