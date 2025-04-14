import mongoose from "mongoose";
import logger from "@src/utils/logger";

const connectMongodb = async (): Promise<void> => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        logger.error("❌ MONGODB_URI is not defined in environment variables.");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        logger.info("✅ Connected to MongoDB", { label: "MongoDB" });
    } catch (error) {
        logger.error(`❌ MongoDB connection error: ${error}`, { label: "MongoDB" });
        process.exit(1);
    }
};

export default connectMongodb;
