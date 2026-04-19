import React from 'react';
import { FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function RecentActivity({ submissions }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'evaluated':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'flagged':
        return <AlertTriangle size={18} className="text-red-500" />;
      case 'pending':
        return <Clock size={18} className="text-amber-500" />;
      default:
        return <FileText size={18} className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'evaluated':
        return 'Evaluated';
      case 'flagged':
        return 'Flagged for Review';
      case 'pending':
        return 'Pending Evaluation';
      default:
        return status;
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{submission.assignmentName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(submission.submittedAt)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(submission.status)}
                    <span className="ml-2 text-sm text-gray-700">{getStatusText(submission.status)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {submission.score !== undefined ? (
                    <div className="text-sm font-medium text-gray-900">{submission.score}%</div>
                  ) : (
                    <div className="text-sm text-gray-500">—</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
