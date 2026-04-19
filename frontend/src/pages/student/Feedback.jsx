import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentSubmissionFeedback() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/student/getSubmissions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!submissions.length) return <div>No feedback found.</div>;

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-4">All Assignment Feedback</h2>
      {submissions.map((submission, sIdx) => (
        <div
          key={submission._id || sIdx}
          className="mb-8 p-4 border rounded-lg bg-gray-100"
        >
          <h3 className="text-lg font-semibold mb-2">
            Assignment:{" "}
            {submission.assignmentTitle ||
              submission.assignmentId?.title ||
              `#${sIdx + 1}`}
          </h3>
          <div className="mb-2">
            <strong>Grade:</strong> {submission.grade ?? "Not graded yet"}
          </div>
          <div className="mb-2">
            <strong>Status:</strong> {submission.status}
          </div>
          <div className="mb-2">
            <strong>Plagiarism Score:</strong>{" "}
            {submission.plagiarismScore ?? "N/A"}
          </div>

          <h4 className="text-md font-semibold mt-4 mb-2">
            Per-Question Feedback:
          </h4>
          <div className="space-y-4">
            {submission.results?.length ? (
              submission.results.map((result, idx) => (
                <div key={idx} className="p-4 border rounded bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold">
                        Question {result.question}
                      </span>
                      {result.topic && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({result.topic})
                        </span>
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="mr-2 font-medium">Score:</span>
                      {result.score}
                      <span className="ml-4 mr-2 font-medium">Similarity:</span>
                      {result.similarity}%
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-green-700">
                      Your Answer:
                    </span>
                    <div className="bg-gray-50 p-2 rounded border mt-1 text-gray-700">
                      {result.student_answer || (
                        <span className="italic text-gray-400">No answer</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">
                      Reference Answer:
                    </span>
                    <div className="bg-gray-50 p-2 rounded border mt-1 text-gray-700">
                      {result.reference_answer}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="italic text-gray-500">
                No question results available.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
