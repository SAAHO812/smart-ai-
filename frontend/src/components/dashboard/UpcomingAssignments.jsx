import React from "react";
import { FileText, Calendar } from "lucide-react";

export default function UpcomingAssignments({ assignments }) {
  // Sort assignments by due date (closest first)
  const sortedAssignments = [...assignments]
    .filter((a) => a.status === "published")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: "bg-blue-100 text-blue-800",
      History: "bg-amber-100 text-amber-800",
      Chemistry: "bg-green-100 text-green-800",
      Physics: "bg-purple-100 text-purple-800",
      "Computer Science": "bg-indigo-100 text-indigo-800",
      English: "bg-pink-100 text-pink-800",
      Biology: "bg-emerald-100 text-emerald-800",
    };
    return colors[subject] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="card divide-y divide-gray-200">
      {sortedAssignments.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500 text-sm">No upcoming assignments</p>
        </div>
      ) : (
        sortedAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FileText size={18} className="text-gray-400" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {assignment.title}
                  </h4>
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubjectColor(
                      assignment.subject
                    )}`}
                  >
                    {assignment.subject}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  Due: {formatDate(assignment.dueDate)}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
