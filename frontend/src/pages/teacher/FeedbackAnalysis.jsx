import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FeedbackAnalysis() {
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [reportHtml, setReportHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/getSubjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data.subjects);
      setSubjects(response.data.subjects);
    } catch (err) {
      setError("Failed to load subjects");
      console.error(err);
    }
  };

  const fetchAssignments = async (subject) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/getAssignment/${subject}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data.assignments);
      setAssignments(response.data.assignments);
    } catch (err) {
      setError("Failed to load assignments");
      console.error(err);
    }
  };

  const generateReport = async (assignmentId) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/generateClassReport`,
        {
          subject: selectedSubject,
          assignmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "text",
        }
      );
      setReportHtml(response.data);
    } catch (err) {
      setError("Failed to generate report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    setSelectedAssignment("");
    setReportHtml("");
    if (subjectId) {
      fetchAssignments(subjectId);
    } else {
      setAssignments([]);
    }
  };

  const handleAssignmentChange = (e) => {
    const assignmentId = e.target.value;
    setSelectedAssignment(assignmentId);
    if (assignmentId) {
      generateReport(assignmentId);
    } else {
      setReportHtml("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Class Performance Report</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject
          </label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Subject</option>
            {Array.isArray(subjects) &&
              subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="assignment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Assignment
          </label>
          <select
            id="assignment"
            value={selectedAssignment}
            onChange={handleAssignmentChange}
            disabled={!selectedSubject}
            className="w-full p-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            <option value="">Select Assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment._id} value={assignment._id}>
                {assignment.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {reportHtml && (
        <div className="mt-6">
          <div
            className="bg-white p-4 rounded-lg shadow"
            dangerouslySetInnerHTML={{ __html: reportHtml }}
          />
        </div>
      )}
    </div>
  );
}
