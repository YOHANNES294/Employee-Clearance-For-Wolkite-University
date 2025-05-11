import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  mongoose.set("debug", true);

  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "wku_cms",
      serverSelectionTimeoutMS: 50000,
      connectTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      maxPoolSize: 10,
      retryWrites: true,
      family: 4,
    });

    isConnected = true;
    console.log("MongoDB connected to database:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    isConnected = false;
    throw new Error("Failed to connect to MongoDB");
  }
};