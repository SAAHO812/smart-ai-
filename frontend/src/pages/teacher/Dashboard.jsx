import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart2, Clock, FileText, AlertTriangle } from "lucide-react";

// Helper for formatting dates
function formatDate(dateStr, withTime = false) {
  const d = new Date(dateStr);
  return withTime
    ? d.toLocaleDateString() + " " + d.toLocaleTimeString()
    : d.toLocaleDateString();
}

export default function TeacherDashboard() {
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        // Make concurrent requests with axios and async/await
        const [subsRes, assignsRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/recentSubmissions`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getAssignments`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);
        // console.log(assignsRes.data.assignments);
        setRecentSubmissions(subsRes.data);
        setAssignments(assignsRes.data.assignments);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Dynamic statistics
  const totalSubmissions = recentSubmissions.length;
  const pendingSubmissions = recentSubmissions.filter(
    (s) => s.status === "pending"
  ).length;
  const flaggedSubmissions = recentSubmissions.filter(
    (s) => s.status === "flagged"
  ).length;
  const avgScore =
    recentSubmissions
      .filter((s) => typeof s.grade === "number")
      .reduce((acc, curr) => acc + (curr.grade || 0), 0) /
    (recentSubmissions.filter((s) => typeof s.grade === "number").length || 1);

  const stats = [
    {
      id: 1,
      title: "Total Submissions",
      value: totalSubmissions,
      icon: <FileText className="text-blue-500" />,
      color: "blue",
    },
    {
      id: 2,
      title: "Pending Reviews",
      value: pendingSubmissions,
      icon: <Clock className="text-amber-500" />,
      color: "amber",
    },
    {
      id: 3,
      title: "Flagged for Review",
      value: flaggedSubmissions,
      icon: <AlertTriangle className="text-red-500" />,
      color: "red",
    },
    {
      id: 4,
      title: "Average Score",
      value: `${isNaN(avgScore) ? "--" : avgScore.toFixed(1) + "%"}`,
      icon: <BarChart2 className="text-green-500" />,
      color: "green",
    },
  ];

  // Upcoming assignments (sorted by due date, only future)
  const now = new Date();
  const upcomingAssignments = assignments
    .filter((a) => new Date(a.dueDate) > now)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5); // Show top 5

  return (
    <div className="animate-fade-in p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your classroom activities
        </p>
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

          {/* Activity and assignments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="overflow-x-auto">
                {recentSubmissions.length === 0 ? (
                  <div className="text-gray-500">No recent submissions.</div>
                ) : (
                  <table className="min-w-full bg-white rounded-lg shadow">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">Student</th>
                        <th className="px-4 py-2 text-left">Assignment</th>
                        <th className="px-4 py-2 text-left">Submitted</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSubmissions.map((sub) => (
                        <tr key={sub._id}>
                          <td className="px-4 py-2">
                            {sub.studentId?.name || "Unknown"}
                          </td>
                          <td className="px-4 py-2">
                            {sub.assignmentId?.title || "Untitled"}
                          </td>
                          <td className="px-4 py-2">
                            {formatDate(sub.createdAt, true)}
                          </td>
                          <td className="px-4 py-2 capitalize">{sub.status}</td>
                          <td className="px-4 py-2">
                            {typeof sub.grade === "number"
                              ? `${sub.grade}%`
                              : "--"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Upcoming Assignments */}
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
                      <div className="text-sm text-gray-600">
                        {a.subject} &middot; Due: {formatDate(a.dueDate)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {a.description}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
