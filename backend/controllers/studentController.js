import Submission from "../models/submissionModel.js";
import { v2 as cloudinary } from "cloudinary";
import Assignment from "../models/assignmentModel.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAssignments = async (req, res) => {
  // console.log('REQ.USER:', req.user);
  try {
    const assignments = await Assignment.find({})
      .populate("createdBy", "name email")
      .lean();

    const submissions = await Submission.find({
      studentId: req.user._id,
    }).lean();

    const data = assignments.map((a) => {
      const sub = submissions.find(
        (s) => s.assignmentId.toString() === a._id.toString()
      );
      return {
        ...a,
        status: sub ? "submitted" : "pending",
        score: sub?.grade ?? null,
      };
    });
    res.status(200).json({ success: true, assignments: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    // console.log(req.user);
    const studentId = req.user._id;
    const submissions = await Submission.find({ studentId }).populate('assignmentId');
    // .populate("createdBy", "name email")
    res.status(200).json({ success: true, submissions: submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const studentId = req.user._id;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "Smart-Check-AI" },
      async (error, cloudinaryResult) => {
        if (error) {
          return res
            .status(500)
            .json({ error: "Failed to upload to Cloudinary." });
        }

        const submission = new Submission({
          assignmentId,
          studentId,
          fileUrl: cloudinaryResult.secure_url,
          status:"submitted"
        });
        await submission.save();
        res.status(201).json({ success: true, submission });
      }
    );

    result.end(req.file.buffer);
  } catch (err) {
    console.error("Error submitting assignment:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
