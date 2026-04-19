import { AlertTriangle, Info } from 'lucide-react';

export default function SimilarityReport({ result }) {
  const getSeverity = (score) => {
    if (score < 20) return { level: 'low', color: 'green' };
    if (score < 50) return { level: 'moderate', color: 'amber' };
    return { level: 'high', color: 'red' };
  };

  const severity = getSeverity(result.plagiarismScore);

  const severityColors = {
    low: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      ring: 'ring-green-600/20',
      progress: 'bg-green-500',
    },
    moderate: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      ring: 'ring-amber-600/20',
      progress: 'bg-amber-500',
    },
    high: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      ring: 'ring-red-600/20',
      progress: 'bg-red-500',
    },
  };

  const getSimilarityColors = (similarity) => {
    if (similarity < 30) return 'bg-green-100 text-green-800';
    if (similarity < 70) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div>
      {/* Summary section */}
      <div className={`${severityColors[severity.level].bg} p-4 rounded-lg mb-6`}>
        <div className="flex items-start">
          {severity.level === 'high' && (
            <div className="mr-3 mt-0.5">
              <AlertTriangle className="text-red-500" size={20} />
            </div>
          )}
          <div>
            <h3 className={`font-medium ${severityColors[severity.level].text}`}>
              {severity.level === 'low'
                ? 'Low similarity detected'
                : severity.level === 'moderate'
                ? 'Moderate similarity detected'
                : 'High similarity detected - potential plagiarism'}
            </h3>
            <p className="text-sm text-gray-700 mt-1">
              This document has a {result.plagiarismScore}% similarity score with existing sources.
              {severity.level === 'high' && ' Review is strongly recommended.'}
            </p>
          </div>
        </div>
      </div>

      {/* Overall score visualization */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Overall Similarity Score</h3>
        <div className="flex items-center">
          <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full ${severityColors[severity.level].progress}`}
              style={{ width: `${result.plagiarismScore}%` }}
            ></div>
          </div>
          <span className={`ml-3 text-lg font-semibold ${severityColors[severity.level].text}`}>
            {result.plagiarismScore}%
          </span>
        </div>
      </div>

      {/* Similar content matches */}
      <div>
        <h3 className="text-lg font-medium mb-4">Matched Content</h3>
        <div className="space-y-4">
          {result.matches.length === 0 ? (
            <div className="p-3 text-gray-500">No similar content found</div>
          ) : (
            result.matches.map((match, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                  <div className="text-sm font-medium">Match #{index + 1}</div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getSimilarityColors(
                      match.similarity
                    )}`}
                  >
                    {match.similarity}% Similar
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 text-sm mb-2 italic">"{match.text}"</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Info size={14} className="mr-1" />
                    Source: {match.source}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end space-x-3">
        <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
          Download Full Report
        </button>
        <button className="btn btn-primary">
          Save Analysis Results
        </button>
      </div>
    </div>
  );
}
