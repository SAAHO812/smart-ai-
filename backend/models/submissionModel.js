import mongoose, { Schema } from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "submitted","checked", "flagged", "evaluated", "late"],
      default: "pending",
    },
    grade: { type: Number },
    plagiarismScore: { type: Number },
    matchedWith: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        similarity: Number,
      },
    ],
    results: [
      {
        question: { type: Number },
        score: { type: Number },
        similarity: { type: Number },
        topic: { type: String },
        student_answer: { type: String },
        reference_answer: { type: String },
        feedback:[{type:String}]
      },
    ],
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
