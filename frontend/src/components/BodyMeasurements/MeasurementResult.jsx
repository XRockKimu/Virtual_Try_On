export default function MeasurementResult({ result, onReset }) {
  // Define upper body measurements to display
  const upperBodyKeys = [
    'shoulder_width',
    'chest_width',
    'chest_circumference',
    'waist_width',
    'waist',
    'arm_length',
    'shirt_length'
  ];

  // Extract measurements from result.measurements object
  const measurements = [];
  const measurementsData = result.measurements || result;
  
  Object.entries(measurementsData).forEach(([key, value]) => {
    // Only include upper body measurements
    if (upperBodyKeys.includes(key) && typeof value === 'number' && value > 0) {
      const label = key.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      measurements.push({ key, label, value });
    }
  });

  return (
    <div className="mt-8 border-t pt-8">
      <div className="bg-gray-50 rounded-xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Measurements Complete!</h3>
        </div>
        
        {measurements.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {measurements.map(({ key, label, value }) => (
                <div key={key} className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-gray-300 transition-all">
                  <p className="text-sm font-semibold text-gray-600 mb-2">{label}</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {value.toFixed(1)}
                    <span className="text-lg ml-1 text-gray-600">cm</span>
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border-2 border-gray-200 mb-8">
            <p className="text-gray-600">No measurements found in the response.</p>
            {result.message && (
              <p className="text-gray-500 mt-2">{result.message}</p>
            )}
          </div>
        )}

        {result.message && measurements.length > 0 && (
          <div className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg text-center mb-6">
            <p className="font-medium">{result.message}</p>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
          >
            Measure Again
          </button>
        </div>
      </div>
    </div>
  );
}
