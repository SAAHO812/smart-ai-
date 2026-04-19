import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, CheckCircle2, BarChart2, AlertTriangle } from "lucide-react";

// Helper for formatting dates
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

export default function StudentDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch student submissions and assignments
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [subsRes, assignsRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/student/getSubmissions`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/student/getAssignments`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
        ]);
        console.log(subsRes.data.submissions);
        console.log(assignsRes.data.assignments);
        setSubmissions(subsRes.data.submissions);
        setAssignments(assignsRes.data.assignments);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats
  const completedAssignments = submissions.filter(
    (s) => s.status === "checked" || s.status === "evaluated"
  ).length;
  const now = new Date();
  const submittedAssignmentsMap = new Map();
  submissions.forEach((s) => {
    submittedAssignmentsMap.set(
      String(s.assignmentId?._id || s.assignmentId),
      s.status
    );
  });

  const pendingAssignments = assignments.filter((a) => {
    const assignmentIdStr = String(a._id);
    const status = submittedAssignmentsMap.get(assignmentIdStr);
    return (
      new Date(a.dueDate) > now &&
      (!status ||
        status === "pending" ||
        status === "submitted" ||
        status === "late")
    );
  }).length;
  const flaggedAssignments = submissions.filter(
    (s) => s.status === "flagged"
  ).length;
  const avgScore =
    submissions
      .filter((s) => typeof s.grade === "number")
      .reduce((acc, curr) => acc + (curr.grade || 0), 0) /
    (submissions.filter((s) => typeof s.grade === "number").length || 1);

  // Performance per subject
  const subjectStats = {};
  submissions.forEach((sub) => {
    const subject = sub.assignmentId?.subject || "Other";
    if (typeof sub.grade === "number") {
      if (!subjectStats[subject])
        subjectStats[subject] = { total: 0, count: 0 };
      subjectStats[subject].total += sub.grade;
      subjectStats[subject].count += 1;
    }
  });

  const performance = Object.entries(subjectStats).map(
    ([subject, { total, count }]) => ({
      subject,
      percent: count ? Math.round(total / count) : 0,
    })
  );
  const submittedAssignmentIds = new Set(
    submissions.map((s) => String(s.assignmentId?._id || s.assignmentId))
  );
  const upcomingAssignments = assignments
    .filter(
      (a) =>
        new Date(a.dueDate) > now && !submittedAssignmentIds.has(String(a._id))
    )
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Recent feedback (last 2 graded submissions)
  const recentFeedback = submissions
    .filter(
      (s) => typeof s.grade === "number" && s.results && s.results.length > 0
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 2)
    .map((s) => ({
      assignment: s.assignmentId?.title || "Assignment",
      score: s.grade,
      feedback: s.results?.map((r) => r.feedback?.join(" ")).join(" ") || "",
      date: formatDate(s.updatedAt),
    }));

  // Dashboard stats
  const stats = [
    {
      id: 1,
      title: "Completed Assignments",
      value: completedAssignments,
      icon: <CheckCircle2 className="text-green-500" />,
      color: "green",
    },
    {
      id: 2,
      title: "Pending Assignments",
      value: pendingAssignments,
      icon: <Clock className="text-amber-500" />,
      color: "amber",
    },
    {
      id: 3,
      title: "Average Score",
      value: `${isNaN(avgScore) ? "--" : Math.round(avgScore) + "%"}`,
      icon: <BarChart2 className="text-blue-500" />,
      color: "blue",
    },
    {
      id: 4,
      title: "Flagged Assignments",
      value: flaggedAssignments,
      icon: <AlertTriangle className="text-red-500" />,
      color: "red",
    },
  ];

  // Handler for feedback card click
  const handleFeedbackClick = () => {
    window.location.href = "http://localhost:5173/student/feedback";
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your academic progress</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className={`bg-white shadow rounded-lg p-4 flex items-center`}
              >
                <div className="mr-4 text-2xl">{stat.icon}</div>
                <div>
                  <div
                    className={`text-lg font-semibold text-${stat.color}-700`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-gray-500">{stat.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance and assignments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Performance Overview
                </h2>
                <div className="space-y-4">
                  {performance.length === 0 ? (
                    <div className="text-gray-500">
                      No performance data available.
                    </div>
                  ) : (
                    performance.map(({ subject, percent }) => (
                      <div key={subject}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {subject}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {percent}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Upcoming Assignments
              </h2>
              {upcomingAssignments.length === 0 ? (
                <div className="text-gray-500">No upcoming assignments.</div>
              ) : (
                <ul className="space-y-3">
                  {upcomingAssignments.map((a) => (
                    <li key={a._id} className="bg-white shadow rounded p-4">
                      <div className="font-semibold text-gray-900">
                        {a.title}
                      </div>
                      <div className="text-xs inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700 mb-1">
                        {a.subject}
                      </div>
                      <div className="text-sm text-gray-600">
                        Due: {formatDate(a.dueDate)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Recent feedback */}
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Feedback
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentFeedback.length === 0 ? (
                <div className="text-gray-500">No recent feedback.</div>
              ) : (
                recentFeedback.map((item, index) => (
                  <div
                    key={index}
                    className="card p-4 cursor-pointer hover:bg-gray-50 transition"
                    onClick={handleFeedbackClick}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleFeedbackClick();
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.assignment}
                        </h3>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {item.score}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.feedback}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
