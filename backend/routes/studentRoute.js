import express from "express";
import { submitAssignment, getAssignments, getSubmissions } from "../controllers/studentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({ storage });

const studentRoute = express.Router();


studentRoute.post("/submitAssignment",authMiddleware, upload.single("file"), submitAssignment);
studentRoute.get("/getAssignments", authMiddleware, getAssignments);
studentRoute.get("/getSubmissions",authMiddleware,getSubmissions);
export default studentRoute;
