import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("DB Connected"));
};

export default connectDB;
