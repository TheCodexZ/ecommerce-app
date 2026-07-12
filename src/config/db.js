const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        console.error("Please check your MONGO_URI in the server/.env file.");
    }
};

module.exports = connectDB;
