import express from "express";
import { checkAssignmentPlagiarism, evaluate, generateClassPerformance, generateQuestions, getAllAssignments, getAssignmentForSubject, getProfile, getRecentSubmissions, getSubjects, getSubmissions, uploadAnswerKey, uploadAssignment } from "../controllers/teacherController.js";
import {authMiddleware} from "../middleware/authMiddleware.js"
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const teacherRoute = express.Router();

teacherRoute.post("/generateQuestions",generateQuestions);
teacherRoute.get("/getAssignment/:subject",authMiddleware,getAssignmentForSubject);
teacherRoute.get("/getAssignments",authMiddleware,getAllAssignments);
teacherRoute.post("/checkPlagiarism/:assignmentId",authMiddleware,checkAssignmentPlagiarism);
teacherRoute.get("/getSubmissions/:id",authMiddleware,getSubmissions);
teacherRoute.get("/getProfile",authMiddleware,getProfile);
teacherRoute.get("/getSubjects",authMiddleware,getSubjects);
teacherRoute.post("/generateClassReport/",authMiddleware,generateClassPerformance);
teacherRoute.post("/evaluate/:assignmentId",authMiddleware,evaluate);
teacherRoute.post("/uploadAnswerKey/:assignmentId",authMiddleware,upload.single("file"),uploadAnswerKey);
teacherRoute.post('/uploadAssignment', authMiddleware,upload.single("file"),uploadAssignment);
teacherRoute.get("/recentSubmissions",authMiddleware,getRecentSubmissions);
export default teacherRoute;
