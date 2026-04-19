import express from "express";
import cors from "cors";
import teacherRoute from "./routes/teacherRoutes.js";
import studentRoute from "./routes/studentRoute.js";
import authRoute from "./controllers/auth.js";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
connectDB();
const PORT = 5000;

app.use("/api", teacherRoute);
app.use("/api/auth", authRoute);
app.use("/api/student", studentRoute);

app.get("/api/health", (_req, res) => {
  return res.json({ status: "OK" });
});

export default app;
