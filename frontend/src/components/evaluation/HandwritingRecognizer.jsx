import { useState } from 'react';
import { Upload, Image, FileText, CheckCircle } from 'lucide-react';

export default function HandwritingRecognizer() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const sampleImages = [
    {
      id: 'sample1',
      name: 'Math Equation',
      thumbnail: 'https://images.pexels.com/photos/6238118/pexels-photo-6238118.jpeg?auto=compress&cs=tinysrgb&w=150',
      fullImage: 'https://images.pexels.com/photos/6238118/pexels-photo-6238118.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 'sample2',
      name: 'Short Essay',
      thumbnail: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=150',
      fullImage: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result);
        setResult(null);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const selectSampleImage = (image) => {
    setUploadedImage(image.fullImage);
    setResult(null);
  };

  const processImage = () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setResult(null);

    setTimeout(() => {
      setIsProcessing(false);

      if (uploadedImage.includes('6238118')) {
        setResult({
          text: "x^2 + 4x - 21 = 0",
          confidence: 94,
          corrected: "x² + 4x - 21 = 0",
          score: 95
        });
      } else if (uploadedImage.includes('6238297')) {
        setResult({
          text: "The water cycle is the continuous movement of water within the Earth and atmosphere. It is a complex system that includes many different processes: evaporation, transpiration, condensation, precipitation, and runoff.",
          confidence: 88,
          score: 85
        });
      } else {
        setResult({
          text: "Sample handwritten text recognized from the image. The AI system has attempted to convert the handwriting to digital text.",
          confidence: 82
        });
      }
    }, 2500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="card p-5">
          <h3 className="text-lg font-medium mb-4">Upload Handwritten Answer</h3>

          {!uploadedImage ? (
            <div>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG or JPEG up to 5MB
                </p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Or select a sample:</p>
                <div className="grid grid-cols-2 gap-2">
                  {sampleImages.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => selectSampleImage(image)}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <img
                        src={image.thumbnail}
                        alt={image.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2 text-sm font-medium">{image.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 border rounded-lg overflow-hidden">
                <img
                  src={uploadedImage}
                  alt="Uploaded handwriting"
                  className="w-full object-contain"
                  style={{ maxHeight: '400px' }}
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setUploadedImage(null)}
                  className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  Change Image
                </button>

                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className={`btn btn-primary ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? 'Processing...' : 'Process Handwriting'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        {isProcessing ? (
          <div className="card p-8 flex flex-col items-center justify-center h-full">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500">Processing handwriting...</p>
            <p className="text-sm text-gray-400 mt-2">Our AI is analyzing the image</p>
          </div>
        ) : result ? (
          <div className="card p-5 animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Recognition Results</h3>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Recognized Text:</h4>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {result.confidence}% Confidence
                </span>
              </div>
              <p className="text-sm text-gray-700 p-3 bg-white border rounded-lg">
                {result.text}
              </p>
            </div>

            {result.corrected && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <CheckCircle size={16} className="text-blue-500 mr-1" />
                  <h4 className="font-medium text-blue-800">Corrected Formula:</h4>
                </div>
                <p className="text-sm text-blue-800 p-3 bg-white border border-blue-100 rounded-lg">
                  {result.corrected}
                </p>
              </div>
            )}

            {result.score !== undefined && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Answer Evaluation:</h4>
                <div className="flex items-center">
                  <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full ${
                        result.score >= 90 ? 'bg-green-500' : 
                        result.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                  <span className={`ml-3 text-lg font-semibold ${
                    result.score >= 90 ? 'text-green-600' : 
                    result.score >= 70 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {result.score}%
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
                Edit Text
              </button>
              <button className="btn btn-primary">
                Save Results
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-8 flex flex-col items-center justify-center h-full">
            <div className="text-gray-400 mb-4">
              <Image size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Image Processed</h3>
            <p className="text-sm text-gray-500 text-center">
              Upload or select a handwritten image, then click "Process Handwriting" to recognize text.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
