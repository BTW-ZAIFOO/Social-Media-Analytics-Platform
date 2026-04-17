import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/social-analytics";

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", (error as Error).message);
    throw error;
  }
};

export default connectDB;
