import { useState } from "react";
import { Sparkles, Save, Copy, Trash, FileText, X } from "lucide-react";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun } from "docx";
export default function QuestionGenerator() {
  const [topic, setTopic] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("medium");
  const [questionTypes, setQuestionTypes] = useState(["Conceptual"]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const downloadAsTxt = (questions) => {
    const content = questions
      .map((q, index) => {
        let base = `Q${index + 1}: ${q.text}\nType: ${q.type}`;
        if (q.hint) base += `\nHint: ${q.hint}`;
        if (q.options && q.options.length > 0) {
          base +=
            `\nOptions:\n` +
            q.options
              .map((opt, i) => `  ${String.fromCharCode(65 + i)}. ${opt.text}`)
              .join("\n");
        }
        return base;
      })
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated_questions.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to download as .docx
  // const downloadAsDocx = async (questions) => {
  //   const doc = new Document();
  //   const children = [];

  //   questions.forEach((q, index) => {
  //     children.push(
  //       new Paragraph({ text: `Q${index + 1}: ${q.text}`, bold: true })
  //     );
  //     children.push(new Paragraph(`Type: ${q.type}`));
  //     if (q.hint) children.push(new Paragraph(`Hint: ${q.hint}`));
  //     if (q.options && q.options.length > 0) {
  //       q.options.forEach((opt, i) => {
  //         children.push(
  //           new Paragraph(`  ${String.fromCharCode(65 + i)}. ${opt.text}`)
  //         );
  //       });
  //     }
  //     children.push(new Paragraph("")); // blank line
  //   });

  //   doc.addSection({ children });

  //   const blob = await Packer.toBlob(doc);
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = "generated_questions.docx";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  // Available question types
  const availableQuestionTypes = [
    { id: "Conceptual", label: "Conceptual" },
    { id: "Application", label: "Application" },
    { id: "Numerical", label: "Numerical" },
  ];
  const handleDeleteQuestion = (indexToDelete) => {
    setGeneratedQuestions((prevQuestions) =>
      prevQuestions.filter((_, index) => index !== indexToDelete)
    );
  };

  // Handle question type selection
  const handleQuestionTypeToggle = (typeId) => {
    if (questionTypes.includes(typeId)) {
      setQuestionTypes(questionTypes.filter((id) => id !== typeId));
    } else {
      setQuestionTypes([...questionTypes, typeId]);
    }
  };
  // Handle generate questions
  const handleGenerateQuestions = async () => {
    if (!topic || questionTypes.length === 0) return;
    setIsGenerating(true);
    setGeneratedQuestions([]);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/generateQuestions`,
        {
          topic,
          difficulty: difficultyLevel,
          questionTypes,
          numQuestions: numberOfQuestions,
        }
      );
      console.log("Generated Questions:", response.data);
      setGeneratedQuestions(response.data);
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Question Parameters Section */}
      <div>
        <div className="card p-5">
          <h3 className="text-lg font-medium mb-4">Question Parameters</h3>

          <div className="space-y-4">
            {/* <div>
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
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="form-input w-full border border-gray-300 rounded p-2"
                placeholder="Enter topic"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <div className="flex space-x-4">
                {["easy", "medium", "hard"].map((level) => (
                  <div key={level} className="flex items-center">
                    <input
                      type="radio"
                      id={`difficulty-${level}`}
                      name="difficultyLevel"
                      value={level}
                      checked={difficultyLevel === level}
                      onChange={() => setDifficultyLevel(level)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor={`difficulty-${level}`}
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Types
              </label>
              <div className="space-y-2">
                {availableQuestionTypes.map(({ id, label }) => (
                  <div key={id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`question-type-${id}`}
                      checked={questionTypes.includes(id)}
                      onChange={() => handleQuestionTypeToggle(id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor={`question-type-${id}`}
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateQuestions}
              className="btn btn-primary w-full mt-6"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Questions"}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Questions Section */}
      <div>
        <div className="card p-5">
          <h3 className="text-lg font-medium mb-4">Generated Questions</h3>

          {isGenerating ? (
            <div className="text-center">Loading...</div>
          ) : generatedQuestions.length > 0 ? (
            <ul className="space-y-4">
              {generatedQuestions.map((question, index) => (
                <li
                  key={index}
                  className="border p-4 rounded-lg space-y-2 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">
                        Type:{" "}
                        <span className="font-medium">{question.type}</span>
                      </p>
                      <p className="font-medium mt-1">Question:</p>
                      <p className="text-gray-800">{question.text}</p>
                      {question.hint && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Hint:</strong> {question.hint}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 mt-1">
                      <button
                        onClick={() => handleSaveQuestion(question)}
                        className="btn btn-sm btn-secondary flex items-center space-x-1"
                      >
                        <span>Save</span>
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(index)}
                        className="btn btn-sm btn-danger flex items-center space-x-1"
                      >
                        <span>Delete</span>
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>

                  {question.options && (
                    <div className="space-y-1 mt-2">
                      {question.options.map((option, idx) => (
                        <div key={idx} className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            id={`option-${index}-${idx}`}
                            value={option.id}
                            className="mr-2"
                          />
                          <label htmlFor={`option-${index}-${idx}`}>
                            {option.text}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No questions generated yet.</p>
          )}
          {generatedQuestions.length > 0 && (
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => downloadAsTxt(generatedQuestions)}
                className="btn btn-outline flex items-center space-x-2"
              >
                <FileText size={16} />
                <span>Download as TXT</span>
              </button>
              {/* <button
                onClick={() => downloadAsDocx(generatedQuestions)}
                className="btn btn-outline flex items-center space-x-2"
              >
                <FileText size={16} />
                <span>Download as Word</span>
              </button> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
