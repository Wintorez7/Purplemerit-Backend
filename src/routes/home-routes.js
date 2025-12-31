const express = require('express')
const authMiddleware = require('../middleware/auth-Middleware')
const isNormalUser = require('../middleware/user-middleware')
const router = express.Router()


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