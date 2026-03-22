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
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-brand-950 mb-3">Size Suggestion</h2>
        <p className="text-lg text-gray-500 mb-10 max-w-2xl leading-relaxed">Find your perfect fit with our AI-powered size calculator. Enter your details below for a personalized recommendation.</p>

        {!result ? (
          <div className="space-y-12">
            <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100">
              <MeasurementInputs
                age={age}
                setAge={setAge}
                height={height}
                setHeight={setHeight}
                weight={weight}
                setWeight={setWeight}
              />
            </div>

            <ModelTypeSelector modelType={modelType} setModelType={setModelType} />

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-xl text-sm font-medium flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <div className="flex justify-center pt-4">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full max-w-md px-10 py-5 bg-brand-600 text-white font-bold text-xl rounded-2xl hover:bg-brand-700 disabled:bg-brand-200 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    Find My Size
                  </>
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
