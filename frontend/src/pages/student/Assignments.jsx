import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  Flag,
} from "lucide-react";
import axios from "axios";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch both assignments and submissions
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch assignments
      const assignmentsRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/student/getAssignments`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Fetch submissions for these assignments
      const submissionsRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/student/getSubmissions`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Create a map of assignmentId -> submission
      const submissionsMap = {};
      submissionsRes.data.submissions.forEach((sub) => {
        submissionsMap[sub.assignmentId] = sub;
      });

      setAssignments(assignmentsRes.data.assignments);
      setSubmissions(submissionsMap);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileSelect = (assignmentId, e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles((prev) => ({
        ...prev,
        [assignmentId]: e.target.files[0],
      }));
      setUploadProgress(0);
    }
  };

  const handleUpload = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", assignmentId);

    try {
      setUploadProgress(10);
      setError(null);
      setSuccess(null);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/student/submitAssignment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      setUploadProgress(100);
      setSelectedFiles((prev) => ({ ...prev, [assignmentId]: null }));
      setSuccess("Assignment submitted successfully!");

      // Refresh data after successful submission
      await fetchData();

      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setUploadProgress(0);
      setError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    }
  };

  // Helper to get submission status for an assignment
  const getSubmissionStatus = (assignmentId) => {
    const submission = submissions[assignmentId];
    if (!submission) return "pending";

    // Map backend status to frontend display status
    switch (submission.status) {
      case "submitted":
        return "submitted";
      case "checked":
        return "submitted";
      case "evaluated":
        return "graded";
      case "flagged":
        return "flagged";
      case "late":
        return "late";
      default:
        return "pending";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "late":
        return "bg-red-100 text-red-800";
      case "flagged":
        return "bg-orange-100 text-orange-800";
      case "graded":
        return "bg-green-100 text-green-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "late":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case "flagged":
        return <Flag className="h-4 w-4 mr-1" />;
      case "graded":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600 mt-1">View and submit your assignments</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            Your Assignments
          </h2>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-gray-500">
            Loading assignments...
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No assignments found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {assignments.map((assignment) => {
              const submission = submissions[assignment._id];
              const status = getSubmissionStatus(assignment._id);

              return (
                <div
                  key={assignment._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {assignment.title}
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{assignment.subject}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                          {assignment.description && (
                            <>
                              <span className="mx-2 text-gray-300">•</span>
                              <span>{assignment.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusBadge(
                          status
                        )}`}
                      >
                        {getStatusIcon(status)}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>

                      {/* Show plagiarism score if flagged */}
                      {status === "flagged" && submission?.plagiarismScore && (
                        <div className="mt-2 flex items-center text-sm font-medium text-red-600">
                          <Flag className="h-4 w-4 mr-1" />
                          Plagiarism: {submission.plagiarismScore}%
                          {submission.matchedWith?.length > 0 && (
                            <span className="ml-2">
                              (matched with {submission.matchedWith.length}{" "}
                              others)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Show grade if assignment is graded */}
                      {status === "graded" &&
                        submission?.grade !== undefined && (
                          <div className="mt-2 flex items-center text-sm font-medium text-gray-900">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            Grade: {submission.grade}%
                            {submission.results?.length > 0 && (
                              <span className="ml-2">
                                ({submission.results.length} questions
                                evaluated)
                              </span>
                            )}
                          </div>
                        )}

                      {/* Show pending grade if submitted but not graded */}
                      {(status === "submitted" || status === "pending") &&
                        (!submission || submission.grade === undefined) && (
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            Grading in progress
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    {/* <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
                      View Details
                    </button> */}
                    {["pending", "flagged", "late"].includes(status) && (
                      <>
                        <label
                          htmlFor={`file-upload-${assignment._id}`}
                          className="btn btn-secondary cursor-pointer"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                          <input
                            id={`file-upload-${assignment._id}`}
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              handleFileSelect(assignment._id, e)
                            }
                          />
                        </label>
                        {selectedFiles[assignment._id] && (
                          <span className="flex items-center ml-2 text-sm text-gray-500">
                            {selectedFiles[assignment._id].name}
                            {uploadProgress > 0 && uploadProgress < 100 && (
                              <span className="ml-2">({uploadProgress}%)</span>
                            )}
                          </span>
                        )}
                        <button
                          className="btn btn-primary"
                          onClick={() => handleUpload(assignment._id)}
                          disabled={
                            !selectedFiles[assignment._id] || uploadProgress > 0
                          }
                        >
                          {uploadProgress > 0 && uploadProgress < 100
                            ? `Uploading... ${uploadProgress}%`
                            : "Submit Assignment"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
