export default function PerformanceTrends() {
  // Mock performance data
  const performanceData = {
    subjects: ['Mathematics', 'English', 'Science', 'History', 'Computer Science'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    data: [
      {
        subject: 'Mathematics',
        scores: [75, 82, 78, 85, 88]
      },
      {
        subject: 'English',
        scores: [80, 85, 82, 84, 86]
      },
      {
        subject: 'Science',
        scores: [70, 72, 82, 85, 90]
      },
      {
        subject: 'History',
        scores: [65, 70, 75, 72, 78]
      },
      {
        subject: 'Computer Science',
        scores: [90, 85, 95, 92, 95]
      }
    ]
  };

  // Calculate averages
  const calculateAverage = (scores) => {
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  const subjectAverages = performanceData.data.map(subject => ({
    subject: subject.subject,
    average: calculateAverage(subject.scores)
  }));

  // Sort subjects by average score (descending)
  const sortedSubjects = [...subjectAverages].sort((a, b) => b.average - a.average);

  return (
    <div className="space-y-6">
      {/* Overall performance chart */}
      <div className="card p-5">
        <h3 className="text-lg font-medium mb-4">Overall Performance Trends</h3>

        <div className="h-80 relative">
          {/* Simple chart visualization */}
          <div className="absolute inset-0 flex items-end">
            {performanceData.data.map((subject, index) => (
              <div key={index} className="flex-1 flex items-end justify-center h-full pb-8">
                {subject.scores.map((score, scoreIndex) => {
                  const barHeight = score * 0.7; // Scale score to fit in container
                  const barColor = getSubjectColor(subject.subject);

                  return (
                    <div
                      key={scoreIndex}
                      className="mx-1 rounded-t-sm opacity-0 animate-slide-up"
                      style={{
                        height: `${barHeight}%`,
                        backgroundColor: barColor,
                        width: '15px',
                        animation: `slideUp 0.5s ease-out forwards ${scoreIndex * 0.1 + index * 0.05}s`,
                      }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                        {score}%
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around">
            {performanceData.months.map((month, index) => (
              <div key={index} className="text-xs text-gray-500">{month}</div>
            ))}
          </div>

          {/* Y-axis */}
          <div className="absolute top-0 bottom-8 left-0 w-1 border-r border-gray-200"></div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {performanceData.subjects.map((subject, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-sm mr-1"
                style={{ backgroundColor: getSubjectColor(subject) }}
              ></div>
              <span className="text-xs text-gray-700">{subject}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subject ranking */}
      <div className="card p-5">
        <h3 className="text-lg font-medium mb-4">Subject Performance Ranking</h3>

        <div className="space-y-3">
          {sortedSubjects.map((subject, index) => (
            <div key={index} className="relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{subject.subject}</span>
                <span className="text-sm font-semibold">{subject.average.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${subject.average}%`,
                    backgroundColor: getSubjectColor(subject.subject)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-lg font-medium mb-3">Strengths</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="rounded-full bg-green-100 p-1 mr-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm">
                <span className="font-medium">Computer Science</span>: Consistently strong performance with an improvement trend
              </span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-green-100 p-1 mr-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm">
                <span className="font-medium">Science</span>: Significant improvement over time (70% → 90%)
              </span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-green-100 p-1 mr-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm">
                <span className="font-medium">Mathematics</span>: Steady improvement pattern
              </span>
            </li>
          </ul>
        </div>

        <div className="card p-5">
          <h3 className="text-lg font-medium mb-3">Areas for Improvement</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="rounded-full bg-amber-100 p-1 mr-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
              <span className="text-sm">
                <span className="font-medium">History</span>: Lowest overall performance, though showing improvement
              </span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-amber-100 p-1 mr-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
              <span className="text-sm">
                <span className="font-medium">Science</span>: Initial performance was below average, though recent improvements are significant
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper function to get a color for each subject
function getSubjectColor(subject) {
  const colors = {
    'Mathematics': '#3B82F6', // blue
    'English': '#F59E0B', // amber
    'Science': '#10B981', // emerald
    'History': '#8B5CF6', // purple
    'Computer Science': '#EC4899', // pink
    'Biology': '#14B8A6', // teal
    'Physics': '#6366F1', // indigo
    'Chemistry': '#F43F5E', // rose
  };

  return colors[subject] || '#9CA3AF'; // Default to gray
}
