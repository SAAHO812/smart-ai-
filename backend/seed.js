import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing users (if any)
    await User.deleteMany({});

    const users = [
      {
        name: "Test Teacher",
        email: "teacher@test.com",
        password: "password123",
        role: "teacher",
        subjects: ["Mathematics", "Physics"],
        department: "Science",
      },
      {
        name: "Test Student",
        email: "student@test.com",
        password: "password123",
        role: "student",
        subjects: ["Mathematics", "Physics"],
      },
    ];

    await User.insertMany(users);
    console.log("✅ Seed data inserted successfully!");
    console.log("Teacher Login: teacher@test.com / password123");
    console.log("Student Login: student@test.com / password123");

    // Don't exit if we want to keep the memory server running, 
    // but usually seed is a separate process.
    // However, since we use memory server, we need to run this INSIDE the main app or 
    // keep the process alive.
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seedData();
