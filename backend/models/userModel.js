import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    subjects: [{ type: String }],
    department: { type: String }, 
    profilePic: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
