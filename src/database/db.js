const mongoose = require('mongoose')

const connectToDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDb Conneect succesfully") 

    } catch (error) {
        console.log("Mongodb Connection failed",error)
    }
}
 
module.exports = connectToDb