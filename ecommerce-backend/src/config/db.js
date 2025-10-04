const mongoose = require ('mongoose');
require('dotenv').config();

async function connectDB(mongouri){
    const uri = mongouri || process.env.MONGO_URI
    if(!uri){
        throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(uri);
}

module.exports = {connectDB};