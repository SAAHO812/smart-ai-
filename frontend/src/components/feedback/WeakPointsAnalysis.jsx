export default function WeakPointsAnalysis() {
  const topicAnalysis = [
    {
      subject: "Mathematics",
      topics: [
        {
          name: "Calculus",
          masteryLevel: 72,
          subtopics: [
            { name: "Derivatives", masteryLevel: 85 },
            { name: "Integrals", masteryLevel: 65 },
            { name: "Limits", masteryLevel: 58 },
          ],
        },
        {
          name: "Algebra",
          masteryLevel: 84,
          subtopics: [
            { name: "Equations", masteryLevel: 92 },
            { name: "Inequalities", masteryLevel: 88 },
            { name: "Functions", masteryLevel: 78 },
          ],
        },
        {
          name: "Geometry",
          masteryLevel: 65,
          subtopics: [
            { name: "Triangles", masteryLevel: 75 },
            { name: "Circles", masteryLevel: 68 },
            { name: "Coordinate Geometry", masteryLevel: 52 },
          ],
        },
      ],
    },
    {
      subject: "Science",
      topics: [
        {
          name: "Physics",
          masteryLevel: 78,
          subtopics: [
            { name: "Mechanics", masteryLevel: 85 },
            { name: "Thermodynamics", masteryLevel: 72 },
            { name: "Electromagnetism", masteryLevel: 65 },
          ],
        },
        {
          name: "Chemistry",
          masteryLevel: 82,
          subtopics: [
            { name: "Organic Chemistry", masteryLevel: 75 },
            { name: "Periodic Table", masteryLevel: 90 },
            { name: "Chemical Reactions", masteryLevel: 80 },
          ],
        },
        {
          name: "Biology",
          masteryLevel: 88,
          subtopics: [
            { name: "Cell Biology", masteryLevel: 92 },
            { name: "Genetics", masteryLevel: 85 },
            { name: "Ecology", masteryLevel: 78 },
          ],
        },
      ],
    },
  ];

  const weakestTopics = [
    {
      subject: "Mathematics",
      topic: "Geometry",
      subtopic: "Coordinate Geometry",
      masteryLevel: 52,
    },
    {
      subject: "Mathematics",
      topic: "Calculus",
      subtopic: "Limits",
      masteryLevel: 58,
    },
    {
      subject: "Science",
      topic: "Physics",
      subtopic: "Electromagnetism",
      masteryLevel: 65,
    },
    {
      subject: "Mathematics",
      topic: "Calculus",
      subtopic: "Integrals",
      masteryLevel: 65,
    },
    {
      subject: "Science",
      topic: "Chemistry",
      subtopic: "Organic Chemistry",
      masteryLevel: 75,
    },
  ];

  const recommendedResources = [
    {
      title: "Coordinate Geometry Fundamentals",
      type: "Interactive Tutorial",
      url: "#",
      description:
        "A step-by-step guide to coordinate geometry with interactive exercises.",
    },
    {
      title: "Mastering Calculus Limits",
      type: "Video Series",
      url: "#",
      description:
        "Comprehensive video lessons on limits with practice problems.",
    },
    {
      title: "Electromagnetism: Concepts and Applications",
      type: "E-Book",
      url: "#",
      description:
        "A beginner-friendly approach to electromagnetism with visual examples.",
    },
    {
      title: "Integral Calculus Practice Problems",
      type: "Worksheet",
      url: "#",
      description: "Collection of practice problems with detailed solutions.",
    },
  ];

  const getMasteryColor = (level) => {
    if (level >= 85) return "bg-green-500";
    if (level >= 70) return "bg-blue-500";
    if (level >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const getMasteryTextColor = (level) => {
    if (level >= 85) return "text-green-600";
    if (level >= 70) return "text-blue-600";
    if (level >= 50) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="text-lg font-medium mb-5">Topic Mastery Analysis</h3>
        <div className="space-y-8">
          {topicAnalysis.map((subject, subjectIndex) => (
            <div key={subjectIndex}>
              <h4 className="font-medium text-gray-800 mb-3">
                {subject.subject}
              </h4>
              <div className="space-y-5">
                {subject.topics.map((topic, topicIndex) => (
                  <div key={topicIndex}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{topic.name}</span>
                      <span
                        className={`text-sm font-semibold ${getMasteryTextColor(
                          topic.masteryLevel
                        )}`}
                      >
                        {topic.masteryLevel}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                      <div
                        className={`h-2.5 rounded-full ${getMasteryColor(
                          topic.masteryLevel
                        )}`}
                        style={{ width: `${topic.masteryLevel}%` }}
                      ></div>
                    </div>
                    <div className="pl-4 space-y-2">
                      {topic.subtopics.map((subtopic, subtopicIndex) => (
                        <div key={subtopicIndex}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">
                              {subtopic.name}
                            </span>
                            <span
                              className={`text-xs font-medium ${getMasteryTextColor(
                                subtopic.masteryLevel
                              )}`}
                            >
                              {subtopic.masteryLevel}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                            <div
                              className={`h-1.5 rounded-full ${getMasteryColor(
                                subtopic.masteryLevel
                              )}`}
                              style={{ width: `${subtopic.masteryLevel}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-lg font-medium mb-4">Areas That Need Attention</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtopic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mastery Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {weakestTopics.map((topic, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {topic.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {topic.topic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {topic.subtopic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${getMasteryColor(
                            topic.masteryLevel
                          )}`}
                          style={{ width: `${topic.masteryLevel}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-medium ${getMasteryTextColor(
                          topic.masteryLevel
                        )}`}
                      >
                        {topic.masteryLevel}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-lg font-medium mb-4">
          Personalized Learning Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedResources.map((resource, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:shadow-md transition-all hover-scale"
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-primary-700">
                  {resource.title}
                </h4>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  {resource.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {resource.description}
              </p>
              <div className="mt-3">
                <button className="btn btn-primary text-sm py-1">
                  View Resource
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
