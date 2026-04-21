import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connectDB = async () => {
  let dbUrl = process.env.MONGODB_URL;

  if (!dbUrl) {
    console.log("No MONGODB_URL found. Starting in-memory MongoDB...");
    const mongoServer = await MongoMemoryServer.create();
    dbUrl = mongoServer.getUri();
  }

  await mongoose
    .connect(dbUrl)
    .then(() => console.log(`DB Connected: ${dbUrl}`));
};

export default connectDB;
