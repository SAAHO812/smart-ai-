import { useState } from 'react';
import { PlusCircle, FilePlus } from 'lucide-react';
import QuestionGenerator from '../../components/questions/QuestionGenerator';
import AssignmentCreator from '../../components/questions/AssignmentCreator';

export default function QuestionGeneration() {
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Question Generator</h1>
        <p className="text-gray-600 mt-1">Create and manage auto-generated questions for assignments</p>
      </div>

      {/* Tab navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('generator')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'generator'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <PlusCircle size={18} className="mr-2" />
                Generate Questions
              </div>
            </button>

            <button
              onClick={() => setActiveTab('assignment')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assignment'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FilePlus size={18} className="mr-2" />
                Create Assignment
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'generator' ? <QuestionGenerator /> : <AssignmentCreator />}
      </div>
    </div>
  );
}
