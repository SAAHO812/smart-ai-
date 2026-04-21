import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, AlertTriangle, FileText, Loader2 } from "lucide-react";

export default function PlagiarismCheck() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState({
    assignments: false,
    submissions: false,
    checkingAll: false,
    checkingAI: false,
  });
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
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
        const sortedAssignments = (res.data?.assignments || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAssignments(sortedAssignments);
      } catch (err) {
        setError("Failed to load assignments");
        console.error("Error fetching assignments", err);
        setAssignments([]);
      } finally {
        setLoading((prev) => ({ ...prev, assignments: false }));
      }
    };
    fetchAssignments();
  }, []);

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
        console.log(submissions);
      } catch (err) {
        setError("Failed to load submissions");
        console.error("Error fetching submissions", err);
      } finally {
        setLoading((prev) => ({ ...prev, submissions: false }));
      }
    };

    fetchSubmissions();
  }, [selectedAssignment]);

  const handleCheckAllPlagiarism = async () => {
    if (!selectedAssignment) return;

    setLoading((prev) => ({ ...prev, checkingAll: true }));
    setError(null);

    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkPlagiarism/${selectedAssignment}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedSubs = res.data?.data?.submissions;

      if (!Array.isArray(updatedSubs)) {
        throw new Error("Invalid response format");
      }

      setSubmissions((prev) =>
        prev.map((sub) => {
          const updatedSub = updatedSubs.find((s) => s._id === sub._id);
          return updatedSub || sub;
        })
      );
    } catch (err) {
      setError("Plagiarism check failed");
      console.error("Error checking plagiarism", err);
    } finally {
      setLoading((prev) => ({ ...prev, checkingAll: false }));
    }
  };

  const handleCheckAIContent = async () => {
    if (!selectedAssignment) return;

    setLoading((prev) => ({ ...prev, checkingAI: true }));
    setError(null);

    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkAIContent/${selectedAssignment}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedSubs = res.data?.data;

      if (!Array.isArray(updatedSubs)) {
        throw new Error("Invalid response format");
      }

      setSubmissions(updatedSubs);
    } catch (err) {
      setError("AI Content check failed");
      console.error("Error checking AI content", err);
    } finally {
      setLoading((prev) => ({ ...prev, checkingAI: false }));
    }
  };

  const hasPendingSubmissions = submissions.some(
    (sub) => sub.status === "submitted"
  );

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Plagiarism Check</h1>
        <p className="text-gray-600 mt-1">
          Check student submissions for potential plagiarism
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Assignment selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Assignment
        </label>
        <select
          className="w-full p-2 border rounded-md"
          value={selectedAssignment}
          onChange={(e) => setSelectedAssignment(e.target.value)}
          disabled={loading.assignments}
        >
          <option value="">-- Choose an assignment --</option>
          {Array.isArray(assignments) &&
            assignments.map((assignment) => (
              <option key={assignment._id} value={assignment._id}>
                {assignment.title} - {assignment.course} ({assignment.subject})
              </option>
            ))}
        </select>
      </div>

      {/* Action Buttons */}
      {selectedAssignment && submissions.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-4">
          {hasPendingSubmissions && (
            <button
              onClick={handleCheckAllPlagiarism}
              disabled={loading.checkingAll}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
              {loading.checkingAll ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Checking Plagiarism...
                </>
              ) : (
                "Check for Plagiarism"
              )}
            </button>
          )}

          <button
            onClick={handleCheckAIContent}
            disabled={loading.checkingAI}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
          >
            {loading.checkingAI ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Analyzing AI Content...
              </>
            ) : (
              "Check for AI-Generated Content"
            )}
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading.submissions && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      )}

      {/* Submissions list */}
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission._id}
            className="p-4 border rounded-lg bg-white shadow-sm"
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
                {submission.grade && (
                  <span className="text-sm font-medium">
                    Grade: {submission.grade}
                  </span>
                )}
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

            {/* Plagiarism and AI info */}
            {(submission.status === "checked" ||
              submission.status === "flagged" ||
              submission.aiContentScore !== undefined) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {/* Plagiarism Section */}
                {(submission.status === "checked" ||
                  submission.status === "flagged") && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <BarChart className="w-4 h-4 text-blue-600" />
                      Semantic Plagiarism: {submission.plagiarismScore}%
                    </div>
                    {submission.matchedWith?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-500">
                          Similar Submissions:
                        </p>
                        <ul className="list-disc list-inside pl-2">
                          {submission.matchedWith.map((match, index) => (
                            <li key={index} className="text-xs">
                              {match.student?.name || "Other Student"} -{" "}
                              {match.similarity}% match
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Detection Section */}
                {submission.aiContentScore !== undefined && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Loader2
                          className={`w-4 h-4 ${
                            submission.aiContentScore > 50
                              ? "text-purple-600"
                              : "text-green-600"
                          }`}
                        />
                        AI Likelihood: {submission.aiContentScore.toFixed(1)}%
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div
                        className={`h-1.5 rounded-full ${
                          submission.aiContentScore > 50
                            ? "bg-purple-600"
                            : "bg-green-600"
                        }`}
                        style={{ width: `${submission.aiContentScore}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">
                      {submission.aiContentScore > 50
                        ? "⚠️ High probability of AI generation"
                        : "✅ Likely written by a human"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Status message for non-pending submissions */}
            {["evaluated", "late"].includes(submission.status) && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  Plagiarism check not available for evaluated/late submissions
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading.submissions &&
        submissions.length === 0 &&
        selectedAssignment && (
          <div className="text-center py-8 text-gray-500">
            No submissions found for this assignment
          </div>
        )}
    </div>
  );
}
