const express = require('express')
const authMiddleware = require('../middleware/auth-Middleware.js')
const router = express.Router()
const adminMiddleware = require('../middleware/admin-middleware')

router.get('/admin-dashboard',authMiddleware,adminMiddleware,(req,res) => {
    res.json({
        message:"Welcome to Admin Page"
    })
})



module.exports = router