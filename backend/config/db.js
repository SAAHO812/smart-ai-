import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connectDB = async () => {
  let dbUrl = process.env.MONGODB_URL;

  if (!dbUrl) {
    console.log("No MONGODB_URL found. Starting in-memory MongoDB...");
    const mongoServer = await MongoMemoryServer.create();
    dbUrl = mongoServer.getUri();
  }

  const connectOptions = {
    serverSelectionTimeoutMS: 10000,
    family: 4 // Force IPv4
  };

  try {
    await mongoose.connect(dbUrl, connectOptions);
    console.log(`DB Connected: ${dbUrl}`);
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
