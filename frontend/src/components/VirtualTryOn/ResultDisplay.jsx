import { getImageURL } from '../../services/api';

export default function ResultDisplay({ result, model, onReset }) {
  return (
    <div className="text-center space-y-6">
      <div className="bg-gray-50 rounded-xl p-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Result</h3>
        <img
          src={getImageURL(result.image_url)}
          alt="Try-On Result"
          className="max-h-[500px] mx-auto rounded-lg shadow-xl"
        />
        <div className="mt-6 grid grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Model Used</p>
            <p className="font-semibold text-gray-800 capitalize">
              {model === 'gemini' ? 'Google Gemini' : model.toUpperCase()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Category</p>
            <p className="font-semibold text-gray-800">{result.category}</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Processing Time</p>
            <p className="font-semibold text-gray-800">{result.processing_time?.toFixed(2)}s</p>
          </div>
        </div>
      </div>
      <button
        onClick={onReset}
        className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all"
      >
        Try Another
      </button>
    </div>
  );
}
