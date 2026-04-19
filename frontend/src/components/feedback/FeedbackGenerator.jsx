import { useState } from 'react';
import { MessageSquare, Upload, Copy, Download } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function FeedbackGenerator() {
  const { recentSubmissions } = useAppContext();
  const [selectedSubmission, setSelectedSubmission] = useState('');
  const [feedbackMode, setFeedbackMode] = useState('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFeedback, setGeneratedFeedback] = useState(null);

  const feedbackTemplates = {
    standard: 'Balanced feedback with strengths and areas for improvement',
    encouraging: 'More positive tone with emphasis on progress made',
    constructive: 'Focus on specific actionable improvements',
    detailed: 'In-depth analysis of each section with examples'
  };

  const handleSubmissionSelect = (submissionId) => {
    setSelectedSubmission(submissionId);
    setGeneratedFeedback(null);
  };

  const handleGenerateFeedback = () => {
    if (!selectedSubmission) return;

    setIsGenerating(true);
    setGeneratedFeedback(null);

    setTimeout(() => {
      setIsGenerating(false);

      const submission = recentSubmissions.find(s => s.id === selectedSubmission);

      if (submission) {
        if (submission.assignmentName.includes('Algebra')) {
          setGeneratedFeedback({
            summary: feedbackMode === 'encouraging' 
              ? 'Your algebra quiz shows significant improvement in equation solving techniques. Great progress!'
              : 'Your algebra quiz demonstrates competence in solving equations, with some areas needing attention.',
            strengths: [
              'Excellent application of the quadratic formula',
              'Clear step-by-step work showing your thought process',
              'Correct factorization of polynomials'
            ],
            improvements: [
              'Occasional errors in negative number operations',
              'Inconsistent use of algebraic notation',
              feedbackMode === 'detailed'
                ? 'When solving system of equations, remember to check solutions in both equations to validate'
                : 'Double-checking final answers'
            ],
            suggestions:
              feedbackMode === 'constructive' || feedbackMode === 'detailed'
                ? 'Practice problems involving negative numbers and fractions. Review the section on systems of equations, focusing particularly on substitution methods. Try working through example problems backwards to strengthen your understanding.'
                : 'Continue practicing problems with negative numbers and review systems of equations.',
            score: submission.score || 85
          });
        } else if (submission.assignmentName.includes('Essay')) {
          setGeneratedFeedback({
            summary: feedbackMode === 'encouraging'
              ? 'Your essay shows strong analytical thinking and good structure. Your arguments are developing well!'
              : 'Your essay demonstrates analytical thinking with a clear structure, though some arguments need stronger evidence.',
            strengths: [
              'Well-structured introduction and conclusion',
              'Good use of topic sentences to guide the reader',
              'Thoughtful analysis of key historical events'
            ],
            improvements: [
              'Some claims lack supporting evidence',
              'Occasional inconsistencies in argument development',
              feedbackMode === 'detailed'
                ? 'The paragraph discussing economic factors could benefit from specific data or examples to substantiate your claims about industrial growth rates'
                : 'More specific examples needed in some sections'
            ],
            suggestions:
              feedbackMode === 'constructive' || feedbackMode === 'detailed'
                ? 'Focus on incorporating more primary sources to support your arguments. Consider creating an outline before writing to ensure consistent argument development throughout the essay. The sections on economic impacts would benefit from specific statistics or case examples.'
                : 'Add more specific evidence from primary sources to strengthen your arguments.',
            score: submission.score || 78
          });
        } else {
          setGeneratedFeedback({
            summary: feedbackMode === 'encouraging'
              ? 'Your work shows good understanding of core concepts and attention to detail.'
              : 'Your work demonstrates understanding of key concepts with some areas for improvement.',
            strengths: [
              'Clear organization and presentation',
              'Good application of fundamental concepts',
              'Attention to detail in most sections'
            ],
            improvements: [
              'Some conceptual misunderstandings in advanced topics',
              'Occasional lack of thoroughness in explanations',
              'Inconsistent quality across different sections'
            ],
            suggestions:
              feedbackMode === 'constructive' || feedbackMode === 'detailed'
                ? 'Review the textbook chapters covering the more advanced concepts. Try explaining these concepts in your own words to test your understanding. Consider forming a study group to discuss challenging topics and get different perspectives.'
                : 'Review advanced concepts and practice explaining them in your own words.',
            score: submission.score || 82
          });
        }
      }
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="card p-5">
          <h3 className="text-lg font-medium mb-4">Generate Personalized Feedback</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Assignment
            </label>
            <select
              value={selectedSubmission}
              onChange={(e) => handleSubmissionSelect(e.target.value)}
              className="form-input"
            >
              <option value="">-- Select a submission --</option>
              {recentSubmissions.map((submission) => (
                <option key={submission.id} value={submission.id}>
                  {submission.studentName} - {submission.assignmentName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(feedbackTemplates).map(([key, description]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="radio"
                    id={`mode-${key}`}
                    name="feedbackMode"
                    value={key}
                    checked={feedbackMode === key}
                    onChange={() => setFeedbackMode(key)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor={`mode-${key}`} className="ml-2 text-sm text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <span className="block text-xs text-gray-500">{description}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleGenerateFeedback}
              disabled={isGenerating || !selectedSubmission}
              className={`btn btn-primary ${
                isGenerating || !selectedSubmission ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? 'Generating...' : 'Generate Feedback'}
            </button>
          </div>
        </div>

        <div className="mt-6 card p-5">
          <h3 className="text-lg font-medium mb-4">Feedback Options</h3>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed" disabled={!generatedFeedback}>
              <div className="flex items-center">
                <MessageSquare size={18} className="text-primary-500 mr-2" />
                <span className="text-sm">Send feedback to student</span>
              </div>
              <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">Recommended</span>
            </button>

            <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed" disabled={!generatedFeedback}>
              <div className="flex items-center">
                <Copy size={18} className="text-gray-500 mr-2" />
                <span className="text-sm">Copy to clipboard</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed" disabled={!generatedFeedback}>
              <div className="flex items-center">
                <Download size={18} className="text-gray-500 mr-2" />
                <span className="text-sm">Download as PDF</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed" disabled={!generatedFeedback}>
              <div className="flex items-center">
                <Upload size={18} className="text-gray-500 mr-2" />
                <span className="text-sm">Add to grade book</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div>
        {isGenerating ? (
          <div className="card p-8 flex flex-col items-center justify-center h-full">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500">Generating personalized feedback...</p>
            <p className="text-sm text-gray-400 mt-2">Analyzing assignment content and student history</p>
          </div>
        ) : generatedFeedback ? (
          <div className="card p-5 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Generated Feedback</h3>
              <div className="flex items-center">
                <span className="text-sm font-semibold mr-1">Score:</span>
                <span className="text-sm font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {generatedFeedback.score}/100
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Summary</h4>
                <p className="text-sm text-gray-700">{generatedFeedback.summary}</p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {generatedFeedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <div className="rounded-full bg-green-200 p-1 mr-2 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-sm text-green-800">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">Areas for Improvement</h4>
                <ul className="space-y-1">
                  {generatedFeedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="rounded-full bg-amber-200 p-1 mr-2 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      </div>
                      <span className="text-sm text-amber-800">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Suggestions for Growth</h4>
                <p className="text-sm text-blue-800">{generatedFeedback.suggestions}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="btn btn-secondary">
                Edit Feedback
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-8 flex flex-col items-center justify-center h-full">
            <div className="text-gray-400 mb-4">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Feedback Generated</h3>
            <p className="text-sm text-gray-500 text-center">
              Select a submission and feedback style, then click "Generate Feedback" to create personalized feedback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
