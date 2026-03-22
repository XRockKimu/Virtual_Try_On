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
    <div className="mt-12 border-t border-gray-100 pt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-brand-50/50 rounded-3xl p-8 md:p-12 border border-brand-100/50">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-4 shadow-sm">Analysis Successful</div>
          <h3 className="text-4xl font-extrabold text-brand-950 tracking-tight mb-3">Your Body Profile</h3>
          <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">We've extracted these precise measurements from your photos to help you find the best fit.</p>
        </div>
        
        {measurements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {measurements.map(({ key, label, value }) => (
              <div key={key} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-brand-500 transition-colors">{label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900 group-hover:text-brand-900 transition-colors">
                    {value.toFixed(1)}
                  </span>
                  <span className="text-sm font-bold text-gray-400 uppercase">cm</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 mb-10">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-gray-500 font-bold">No measurements detected.</p>
            {result.message && (
              <p className="text-gray-400 text-sm mt-2">{result.message}</p>
            )}
          </div>
        )}

        {result.message && measurements.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm border border-brand-200 text-brand-900 px-6 py-4 rounded-2xl text-center mb-8 font-bold text-sm shadow-sm max-w-2xl mx-auto">
            {result.message}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={onReset}
            className="px-12 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-md hover:shadow-xl flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            New Measurement
          </button>
        </div>
      </div>
    </div>
  );
}
