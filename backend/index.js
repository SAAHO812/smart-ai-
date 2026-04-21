import express from "express";
import cors from "cors";
import teacherRoute from "./routes/teacherRoutes.js";
import studentRoute from "./routes/studentRoute.js";
import authRoute from "./controllers/auth.js";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import User from "./models/userModel.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const seedDB = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    console.log("Seeding test users...");
    await User.create([
      {
        name: "Test Teacher",
        email: "teacher@test.com",
        password: "password123",
        role: "teacher",
        subjects: ["Mathematics", "Physics"],
      },
      {
        name: "Test Student",
        email: "student@test.com",
        password: "password123",
        role: "student",
        subjects: ["Mathematics"],
      }
    ]);
    console.log("✅ Test users created: teacher@test.com / student@test.com (password123)");
  }
};

connectDB().then(seedDB);
const PORT = 5000;

app.use("/api", teacherRoute);
app.use("/api/auth", authRoute);
app.use("/api/student", studentRoute);

app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});

app.get("/api/health", (_req, res) => {
  return res.json({ status: "OK" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});

export default app;
