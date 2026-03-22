export default function HeightInput({ height, setHeight }) {
  return (
    <div className="mb-10 max-w-md mx-auto group">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-bold text-gray-700 tracking-tight group-focus-within:text-brand-600 transition-colors">
          Your Height
        </label>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Required for Scaling</span>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="e.g., 170"
          className="w-full pl-11 pr-16 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
          min="100"
          max="250"
          step="0.1"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
          CM
        </div>
      </div>
      <p className="mt-2 text-[11px] text-gray-400 text-center font-medium">Please enter your exact height for the most accurate body analysis.</p>
    </div>
  );
}
