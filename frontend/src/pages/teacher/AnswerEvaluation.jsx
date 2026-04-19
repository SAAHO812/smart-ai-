import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, FileText, Loader2, CheckCircle, Upload } from "lucide-react";

export default function AnswerEvaluation() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState({
    assignments: false,
    submissions: false,
  });
  const [evaluating, setEvaluating] = useState(false);
  const [uploadingAnswerKey, setUploadingAnswerKey] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState({
    grade: null,
    feedback: "",
    student: "",
  });

  // Fetch assignments created by the current teacher
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading((prev) => ({ ...prev, assignments: true }));
      setError(null);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/getAssignments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAssignments(res.data?.assignments || []);
      } catch (err) {
        setError("Failed to load assignments");
        console.error("Error fetching assignments", err);
        setAssignments([]);
      } finally {
        setLoading((prev) => ({ ...prev, assignments: false }));
      }
    };
    fetchAssignments();
  }, [token]);

  // Fetch submissions when assignment is selected
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!selectedAssignment) {
        setSubmissions([]);
        return;
      }

      setLoading((prev) => ({ ...prev, submissions: true }));
      setError(null);
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/getSubmissions/${selectedAssignment}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubmissions(res.data);
      } catch (err) {
        setError("Failed to load submissions");
        console.error("Error fetching submissions", err);
      } finally {
        setLoading((prev) => ({ ...prev, submissions: false }));
      }
    };

    fetchSubmissions();
  }, [selectedAssignment, token]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadAnswerKey = async () => {
    if (!file || !selectedAssignment) {
      setError("Please select an assignment and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingAnswerKey(true);
    setError(null);
    // console.log(selectedAssignment);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/uploadAnswerKey/${selectedAssignment}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Answer key uploaded successfully!");
    } catch (err) {
      setError("Failed to upload answer key");
      console.error("Error uploading answer key", err);
    } finally {
      setUploadingAnswerKey(false);
    }
  };

  const handleEvaluateSubmissions = async () => {
    if (!selectedAssignment) {
      setError("Please select an assignment first.");
      return;
    }

    setEvaluating(true);
    setError(null);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/evaluate/${selectedAssignment}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh submissions after evaluation
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/getSubmissions/${selectedAssignment}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmissions(res.data);
      // alert("Evaluation completed successfully!");
    } catch (err) {
      setError("Failed to evaluate submissions");
      console.error("Error evaluating submissions", err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Answer Evaluation</h1>
        <p className="text-gray-600 mt-1">
          Evaluate student submissions by comparing with answer key.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Select Assignment Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Assignment
          </label>
          <select
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            disabled={loading.assignments}
          >
            <option value="">-- Choose an assignment --</option>
            {Array.isArray(assignments) &&
              assignments.map((assignment) => (
                <option key={assignment._id} value={assignment._id}>
                  {assignment.title} - {assignment.course} ({assignment.subject}
                  )
                </option>
              ))}
          </select>
        </div>

        {/* Answer Key Upload Section */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Answer Key Management
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Answer Key
              </label>
              <input
                type="file"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleFileChange}
                disabled={loading.submissions}
              />
            </div>

            <button
              onClick={handleUploadAnswerKey}
              disabled={uploadingAnswerKey || !file || !selectedAssignment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
              {uploadingAnswerKey ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Answer Key
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading state for submissions */}
      {loading.submissions && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2">Loading submissions...</span>
        </div>
      )}

      {/* Submissions list */}
      <div className="space-y-4">
        {submissions.length > 0 && (
          <h2 className="text-xl font-semibold mb-4">Student Submissions</h2>
        )}

        {submissions
          .filter(
            (submission) =>
              submission.status === "evaluated" ||
              submission.status === "checked"
          )
          .map((submission) => (
            <div
              key={submission._id}
              className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <div>
                  <h3 className="font-semibold text-lg">
                    {submission.studentId?.name || "Unknown Student"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {submission.studentId?.email || "No email"}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-1">
                  <span
                    className={`px-2 py-1 text-xs sm:text-sm rounded-md ${
                      submission.status === "flagged"
                        ? "bg-red-100 text-red-800"
                        : submission.status === "evaluated"
                        ? "bg-green-100 text-green-800"
                        : submission.status === "late"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {submission.status}
                  </span>
                  {/* {submission.grade !== undefined && (
                      <span className="text-sm font-medium">
                        Grade: {submission.grade}%
                      </span>
                    )} */}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4" />
                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Submission File
                </a>
              </div>

              {/* Evaluation info */}
              {submission.status === "evaluated" && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <BarChart className="w-4 h-4" />
                      Grade Score: {submission.grade}%
                    </div>
                    <button
                      onClick={() =>
                        setSelectedFeedback({
                          grade: submission.grade,
                          // feedback: submission.feedback,
                          student:
                            submission.studentId?.name || "Unknown Student",
                        }) || setShowModal(true)
                      }
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Result
                    </button>
                  </div>

                  {/* {submission.feedback && (
                    <div className="mt-2 text-sm text-gray-700">
                      <p className="font-medium">Feedback:</p>
                      <p>{submission.results}</p>
                    </div>
                  )} */}
                </div>
              )}
            </div>
          ))}
      </div>
      {/* Evaluate Submissions Section */}
      <div className="border-t pt-4">
        {/* <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Evaluation Controls
        </h3> */}
        <button
          onClick={handleEvaluateSubmissions}
          disabled={evaluating || !selectedAssignment}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
        >
          {evaluating ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              Evaluating...
            </>
          ) : (
            <>
              <BarChart className="w-4 h-4" />
              Evaluate All Checked Submissions
            </>
          )}
        </button>
      </div>
      {/* Empty state */}
      {!loading.submissions &&
        submissions.length === 0 &&
        selectedAssignment && (
          <div className="text-center py-8 text-gray-500">
            No submissions found for this assignment
          </div>
        )}

      {/* Modal for viewing feedback */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-2">
              Result for {selectedFeedback.student}
            </h2>
            <p className="mb-2">
              <span className="font-medium">Grade:</span>{" "}
              {selectedFeedback.grade}%
            </p>
            <div>
              <p className="font-medium mb-1">Feedback:</p>
              <p className="text-gray-700 whitespace-pre-line">
                {selectedFeedback.feedback || "No feedback available."}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
