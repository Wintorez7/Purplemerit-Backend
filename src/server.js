require('dotenv').config();
const express = require('express')

const app = express();
const PORT = process.env.PORT || 3000

// middleware
app.use(express.json());

const cors = require("cors");
app.use(cors());

const connectToDb = require('./database/db.js')

// Routes
const authRoutes = require('./routes/authRoutes.js')
const homeRoutes = require('./routes/home-routes.js')
const adminRoutes = require('./routes/admin-routes.js')
const userRoutes = require("./routes/userRoutes")
const passwordRoutes = require("./routes/passwordRoutes");
// database
connectToDb();

app.use('/api/auth',authRoutes)
app.use('/api/home',homeRoutes)
app.use('/api/admin',adminRoutes)
app.use("/api/users",userRoutes);
app.use("/api/password", passwordRoutes);
 


app.listen(PORT,() => {
    console.log(`server is lisiting at ${PORT}`)
})