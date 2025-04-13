import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBConnection = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        console.error("MongoDB URI is not defined in environment variables");
        return;
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return;
    }
    mongoose.connection.on("error", (error) => {
        console.error("MongoDB connection error:", error);
    });
}

export default DBConnection;