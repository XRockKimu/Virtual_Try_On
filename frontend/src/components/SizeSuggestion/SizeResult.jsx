export default function SizeResult({ result, onReset }) {
  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="bg-brand-600 p-8 text-center text-white">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">Our Recommendation</h3>
          <p className="text-lg font-medium">Based on your body profile</p>
        </div>

        {/* Main Result */}
        <div className="p-10 text-center relative">
          <div className="inline-flex items-center justify-center w-40 h-40 bg-brand-50 rounded-full border-4 border-white shadow-inner mb-6">
            <span className="text-7xl font-extrabold text-brand-900 tracking-tighter">
              {result.recommended_size}
            </span>
          </div>
          
          <div className="max-w-xs mx-auto mb-8">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-brand-500 rounded-full w-[95%]" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              95% Fit Confidence
            </p>
          </div>

          <p className="text-sm text-gray-500 font-medium italic">
            "We think {result.recommended_size} will provide the perfect balance of comfort and style for you."
          </p>
        </div>

        {/* Alternatives */}
        {result.alternatives && result.alternatives.length > 0 && (
          <div className="bg-gray-50/50 border-t border-gray-100 p-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Alternative Matches</h4>
            <div className="grid grid-cols-2 gap-4">
              {result.alternatives.map((alt, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group hover:border-brand-200 transition-colors">
                  <div>
                    <div className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">{alt.size}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{(alt.score * 100).toFixed(0)}% Match</div>
                  </div>
                  <div className="w-10 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300 group-hover:bg-brand-400 transition-colors" style={{ width: `${alt.score * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="p-8 border-t border-gray-100 bg-white">
          <button
            onClick={onReset}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Recalculate Size
          </button>
        </div>
      </div>
      
      <p className="mt-6 text-center text-xs text-gray-400 font-medium">
        Engine: {result.model_version} • Data processed securely
      </p>
    </div>
  );
}
