import { useState, useRef } from 'react';
import { Upload, File } from 'lucide-react';

export default function FileUploader({ onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`card p-10 border-2 border-dashed ${
        isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
      } transition-colors duration-200`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <Upload 
          className={`mx-auto h-12 w-12 ${
            isDragging ? 'text-primary-500' : 'text-gray-400'
          }`} 
        />
        
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          {isDragging ? 'Drop your file here' : 'Upload an assignment'}
        </h3>
        
        <p className="mt-1 text-sm text-gray-500">
          Drag and drop your file here, or click to browse
        </p>
        
        <div className="mt-4">
          <p className="text-xs text-gray-500">
            Supports DOC, DOCX, PDF, TXT, and programming files
          </p>
        </div>
        
        <div className="mt-6">
          <button
            type="button"
            onClick={handleBrowseClick}
            className="btn btn-primary"
          >
            Browse Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".doc,.docx,.pdf,.txt,.py,.java,.js,.html,.css,.cpp"
          />
        </div>
      </div>

      {/* Sample files for demo */}
      <div className="mt-8">
        <p className="text-sm font-medium text-gray-700 mb-2">Or check a sample document:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => {
              const file = new File([""], "original_essay.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
              onFileUpload(file);
            }}
            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <File size={18} className="text-blue-500 mr-2" />
            <span className="text-sm">Original Essay Sample</span>
          </button>
          
          <button
            onClick={() => {
              const file = new File([""], "plagiarized_essay.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
              onFileUpload(file);
            }}
            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <File size={18} className="text-red-500 mr-2" />
            <span className="text-sm">Plagiarized Essay Sample</span>
          </button>
        </div>
      </div>
    </div>
  );
}
