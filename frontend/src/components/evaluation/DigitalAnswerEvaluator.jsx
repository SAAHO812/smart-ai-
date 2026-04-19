import { useState } from 'react';
import { Check, X, AlertTriangle, FileText } from 'lucide-react';

export default function DigitalAnswerEvaluator() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sampleQuestions = [
    {
      id: 'q1',
      text: 'Explain how photosynthesis works and why it is important for life on Earth.',
      subject: 'Biology'
    },
    {
      id: 'q2',
      text: 'Solve for x: 3x² + 5x - 2 = 0',
      subject: 'Mathematics'
    },
    {
      id: 'q3',
      text: 'Discuss the causes and effects of the Industrial Revolution in England.',
      subject: 'History'
    }
  ];

  const sampleAnswers = {
    q1: 'Photosynthesis is the process where plants convert light energy into chemical energy. They use sunlight, water, and carbon dioxide to create glucose and oxygen. This process is vital because it produces oxygen for animals to breathe and provides energy for the food chain.',
    q2: 'To solve for x, I\'ll use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a\nWhere a=3, b=5, c=-2\nx = (-5 ± √(25 - 4(3)(-2))) / 2(3)\nx = (-5 ± √(25 + 24)) / 6\nx = (-5 ± √49) / 6\nx = (-5 ± 7) / 6\nSo x = 1/3 or x = -2',
    q3: 'The Industrial Revolution began in England in the late 18th century. It was caused by several factors including agricultural improvements, population growth, and technological innovations. Effects included urbanization, poor working conditions, and economic growth as manufacturing increased.'
  };

  const selectSampleQuestion = (id) => {
    const selected = sampleQuestions.find(q => q.id === id);
    if (selected) {
      setQuestion(selected.text);
      setAnswer(sampleAnswers[id] || '');
      setResult(null);
    }
  };

  const handleEvaluate = () => {
    if (!question.trim() || !answer.trim()) return;

    setIsLoading(true);
    setResult(null);

    setTimeout(() => {
      setIsLoading(false);

      let mockScore = 0;
      let mockFeedback = '';
      let mockKeyPoints = [];
      let mockSuggestions = [];

      if (question.toLowerCase().includes('photosynthesis')) {
        mockScore = answer.toLowerCase().includes('light') && answer.toLowerCase().includes('oxygen') ? 85 : 65;

        mockKeyPoints = [
          { text: 'Conversion of light energy to chemical energy', present: answer.toLowerCase().includes('energy') },
          { text: 'Use of carbon dioxide and water as reactants', present: answer.toLowerCase().includes('carbon dioxide') && answer.toLowerCase().includes('water') },
          { text: 'Production of glucose and oxygen', present: answer.toLowerCase().includes('glucose') && answer.toLowerCase().includes('oxygen') },
          { text: 'Role in the food chain/web', present: answer.toLowerCase().includes('food chain') }
        ];

        mockFeedback = mockScore > 80
          ? 'Good explanation of the photosynthesis process and its importance!'
          : 'Your answer covers some key aspects of photosynthesis but could be more detailed.';

        mockSuggestions = [
          'Include the chemical equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
          'Mention the role of chlorophyll in capturing light energy',
          'Discuss the light-dependent and light-independent reactions'
        ];
      } else if (question.toLowerCase().includes('solve for x')) {
        mockScore = answer.toLowerCase().includes('quadratic formula') &&
          (answer.toLowerCase().includes('x = 1/3') || answer.toLowerCase().includes('x = -2')) ? 90 : 70;

        mockKeyPoints = [
          { text: 'Proper identification as a quadratic equation', present: answer.toLowerCase().includes('quadratic') },
          { text: 'Correct application of the quadratic formula', present: answer.toLowerCase().includes('quadratic formula') || answer.toLowerCase().includes('√(b² - 4ac)') },
          { text: 'Solution x = 1/3', present: answer.toLowerCase().includes('x = 1/3') || answer.toLowerCase().includes('x = 0.333') },
          { text: 'Solution x = -2', present: answer.toLowerCase().includes('x = -2') }
        ];

        mockFeedback = mockScore > 80
          ? 'Excellent work solving this quadratic equation with clear steps!'
          : 'You have the right approach, but check your calculations and final answers.';

        mockSuggestions = [
          'Show the factorization method as an alternative approach',
          'Verify your answers by substituting them back into the original equation',
          'Check for calculation errors in your arithmetic'
        ];
      } else if (question.toLowerCase().includes('industrial revolution')) {
        mockScore = answer.toLowerCase().includes('england') &&
          answer.toLowerCase().includes('urbanization') ? 80 : 60;

        mockKeyPoints = [
          { text: 'Timeframe of the Industrial Revolution', present: answer.toLowerCase().includes('18th century') },
          { text: 'Major causes (technological, social, economic)', present: answer.toLowerCase().includes('technological') || answer.toLowerCase().includes('population growth') },
          { text: 'Discussion of urbanization', present: answer.toLowerCase().includes('urbanization') },
          { text: 'Impact on working conditions', present: answer.toLowerCase().includes('working conditions') }
        ];

        mockFeedback = mockScore > 75
          ? 'Good analysis of the key causes and effects of the Industrial Revolution!'
          : 'Your answer provides a basic overview but lacks some important details.';

        mockSuggestions = [
          'Include specific technological innovations like the steam engine',
          'Discuss social class changes that resulted from industrialization',
          'Compare the Industrial Revolution in England to its spread in other countries'
        ];
      } else {
        mockScore = answer.length > 100 ? 75 : 60;
        mockFeedback = 'Your answer provides some relevant information.';
        mockKeyPoints = [];
        mockSuggestions = ['Provide more specific details', 'Use examples to support your answer'];
      }

      setResult({
        score: mockScore,
        feedback: mockFeedback,
        keyPoints: mockKeyPoints,
        suggestions: mockSuggestions
      });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="card p-5">
          <h3 className="text-lg font-medium mb-4">Question & Answer</h3>

          <div className="mb-4">
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <textarea
              id="question"
              rows={3}
              className="form-input"
              placeholder="Enter or select a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Sample Questions:</p>
            <div className="grid grid-cols-1 gap-2">
              {sampleQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => selectSampleQuestion(q.id)}
                  className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-sm truncate">{q.text}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{q.subject}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <textarea
              id="answer"
              rows={10}
              className="form-input"
              placeholder="Enter the answer to evaluate..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          <div>
            <button
              onClick={handleEvaluate}
              disabled={isLoading || !question.trim() || !answer.trim()}
              className={`btn btn-primary ${
                isLoading || !question.trim() || !answer.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Evaluating...' : 'Evaluate Answer'}
            </button>
          </div>
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="card p-8 flex flex-col items-center justify-center h-full">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500">Evaluating answer...</p>
            <p className="text-sm text-gray-400 mt-2">Our AI is analyzing the response</p>
          </div>
        ) : result ? (
          <div className="card p-5 animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Evaluation Results</h3>

            <div className="mb-4 flex items-center">
              <div className="mr-3">
                <div className="relative h-16 w-16 rounded-full flex items-center justify-center bg-gray-100">
                  <div className="text-xl font-bold">{result.score}%</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium">
                  {result.score >= 90
                    ? 'Excellent'
                    : result.score >= 80
                      ? 'Good'
                      : result.score >= 70
                        ? 'Satisfactory'
                        : 'Needs Improvement'}
                </h4>
                <p className="text-sm text-gray-600">Overall score based on accuracy and completeness</p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Feedback:</h4>
              <p className="text-sm text-gray-700">{result.feedback}</p>
            </div>

            {result.keyPoints.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Key Points Coverage:</h4>
                <ul className="space-y-2">
                  {result.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      {point.present ? (
                        <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-sm">{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Suggestions for Improvement:</h4>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button className="btn btn-primary">Save Evaluation</button>
            </div>
          </div>
        ) : (
          <div className="card p-8 flex flex-col items-center justify-center h-full">
            <div className="text-gray-400 mb-4">
              <FileText size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Evaluation Yet</h3>
            <p className="text-sm text-gray-500 text-center">
              Enter a question and answer, then click "Evaluate Answer" to see AI-powered results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
