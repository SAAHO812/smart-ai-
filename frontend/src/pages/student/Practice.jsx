import { useState } from 'react';
import { Brain, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export default function Practice() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [practiceStats, setPracticeStats] = useState({
    total: 0,
    correct: 0,
    streak: 0
  });

  const subjectsAndTopics = {
    Mathematics: ['Algebra', 'Geometry', 'Calculus', 'Trigonometry'],
    Science: ['Physics', 'Chemistry', 'Biology', 'Earth Science'],
    English: ['Grammar', 'Vocabulary', 'Literature', 'Writing']
  };

  const generateQuestion = () => {
    if (!subject || !topic) return;

    setIsGenerating(true);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);

    setTimeout(() => {
      setIsGenerating(false);

      if (subject === 'Mathematics' && topic === 'Algebra') {
        setCurrentQuestion({
          id: Date.now(),
          type: 'multiple-choice',
          text: 'Solve for x: 2x + 5 = 13',
          options: [
            { id: 'a', text: '3' },
            { id: 'b', text: '4' },
            { id: 'c', text: '5' },
            { id: 'd', text: '6' }
          ],
          correctAnswer: 'b',
          explanation: 'To solve for x, subtract 5 from both sides: 2x = 8, then divide both sides by 2: x = 4'
        });
      } else if (subject === 'Science' && topic === 'Physics') {
        setCurrentQuestion({
          id: Date.now(),
          type: 'multiple-choice',
          text: 'What is the SI unit of force?',
          options: [
            { id: 'a', text: 'Watt' },
            { id: 'b', text: 'Joule' },
            { id: 'c', text: 'Newton' },
            { id: 'd', text: 'Pascal' }
          ],
          correctAnswer: 'c',
          explanation: 'The Newton (N) is the SI unit of force, defined as the force needed to accelerate 1 kilogram of mass at 1 meter per second squared.'
        });
      } else {
        setCurrentQuestion({
          id: Date.now(),
          type: 'multiple-choice',
          text: `Sample ${subject} question about ${topic}`,
          options: [
            { id: 'a', text: 'Option A' },
            { id: 'b', text: 'Option B' },
            { id: 'c', text: 'Option C' },
            { id: 'd', text: 'Option D' }
          ],
          correctAnswer: 'a',
          explanation: 'This is a sample explanation for the correct answer.'
        });
      }
    }, 1500);
  };

  const checkAnswer = () => {
    if (!selectedAnswer) return;

    setIsAnswerChecked(true);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setPracticeStats(prev => ({
        total: prev.total + 1,
        correct: prev.correct + 1,
        streak: prev.streak + 1
      }));
    } else {
      setPracticeStats(prev => ({
        total: prev.total + 1,
        correct: prev.correct,
        streak: 0
      }));
    }
  };

  const currentTopics = subject ? subjectsAndTopics[subject] || [] : [];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Practice Questions</h1>
        <p className="text-gray-600 mt-1">Generate practice questions to test your knowledge</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Questions Attempted</p>
              <p className="text-2xl font-bold text-primary-600">{practiceStats.total}</p>
            </div>
            <Brain className="h-8 w-8 text-primary-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Correct Answers</p>
              <p className="text-2xl font-bold text-green-600">{practiceStats.correct}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-amber-600">{practiceStats.streak}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-amber-500" />
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setTopic('');
              }}
              className="form-input"
            >
              <option value="">Select a subject</option>
              {Object.keys(subjectsAndTopics).map((subj) => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="form-input"
              disabled={!subject}
            >
              <option value="">Select a topic</option>
              {currentTopics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="form-input"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={generateQuestion}
            disabled={!subject || !topic || isGenerating}
            className={`btn btn-primary ${
              !subject || !topic || isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? 'Generating Question...' : 'Generate Question'}
          </button>
        </div>
      </div>

      {isGenerating ? (
        <div className="card p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-500">Generating your question...</p>
        </div>
      ) : currentQuestion ? (
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.text}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => !isAnswerChecked && setSelectedAnswer(option.id)}
                  disabled={isAnswerChecked}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    isAnswerChecked
                      ? option.id === currentQuestion.correctAnswer
                        ? 'bg-green-50 border-green-500'
                        : option.id === selectedAnswer
                        ? 'bg-red-50 border-red-500'
                        : 'bg-gray-50 border-gray-200'
                      : selectedAnswer === option.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {isAnswerChecked ? (
                        option.id === currentQuestion.correctAnswer ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : option.id === selectedAnswer ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : null
                      ) : (
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          selectedAnswer === option.id ? 'border-blue-500' : 'border-gray-300'
                        }`}>
                          {selectedAnswer === option.id && (
                            <div className="w-3 h-3 m-0.5 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                      )}
                    </div>
                    <span className={`font-medium ${
                      isAnswerChecked
                        ? option.id === currentQuestion.correctAnswer
                          ? 'text-green-700'
                          : option.id === selectedAnswer
                          ? 'text-red-700'
                          : 'text-gray-700'
                        : 'text-gray-700'
                    }`}>
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {isAnswerChecked ? (
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Explanation</h3>
                <p className="text-gray-600">{currentQuestion.explanation}</p>
              </div>

              <button onClick={generateQuestion} className="btn btn-primary">
                Next Question
              </button>
            </div>
          ) : (
            <button
              onClick={checkAnswer}
              disabled={!selectedAnswer}
              className={`btn btn-primary ${
                !selectedAnswer ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Check Answer
            </button>
          )}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">No Question Generated</h2>
          <p className="text-gray-500">
            Select a subject and topic, then click "Generate Question" to start practicing.
          </p>
        </div>
      )}
    </div>
  );
}
