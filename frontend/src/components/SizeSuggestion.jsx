import { useState } from 'react';
import { sizeSuggestionAPI } from '../services/api';
import MeasurementInputs from './SizeSuggestion/MeasurementInputs';
import ModelTypeSelector from './SizeSuggestion/ModelTypeSelector';
import SizeResult from './SizeSuggestion/SizeResult';

export default function SizeSuggestion() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [modelType, setModelType] = useState('decision_tree');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!age || !height || !weight) {
      setError('Please fill in all fields');
      return;
    }

    if (age <= 0 || height <= 0 || weight <= 0) {
      setError('Please enter valid positive numbers');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await sizeSuggestionAPI.predict(age, height, weight, modelType);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAge('');
    setHeight('');
    setWeight('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Size Suggestion</h2>
        <p className="text-gray-600 mb-8">Get personalized size recommendations based on your body measurements</p>

        {!result ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <MeasurementInputs
              age={age}
              setAge={setAge}
              height={height}
              setHeight={setHeight}
              weight={weight}
              setWeight={setWeight}
            />

            <ModelTypeSelector modelType={modelType} setModelType={setModelType} />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-center pt-4">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="px-12 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Calculating...
                  </span>
                ) : (
                  'Get Size Recommendation'
                )}
              </button>
            </div>
          </div>
        ) : (
          <SizeResult result={result} onReset={resetForm} />
        )}
      </div>
    </div>
  );
}
