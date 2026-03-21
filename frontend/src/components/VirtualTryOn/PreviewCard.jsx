export default function PreviewCard({ personPreview, garmentPreview, selectedGarment }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Virtual Try-On Preview
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 border-2 border-blue-200 shadow-md">
          <p className="text-xs font-semibold text-blue-700 mb-2 text-center uppercase tracking-wide">Your Photo</p>
          <img
            src={personPreview}
            alt="Person"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
        <div className="bg-white rounded-lg p-3 border-2 border-purple-200 shadow-md">
          <p className="text-xs font-semibold text-purple-700 mb-2 text-center uppercase tracking-wide">
            Selected Garment
          </p>
          <img
            src={garmentPreview}
            alt="Garment"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      </div>
      <div className="bg-white/50 backdrop-blur rounded-lg p-3">
        <div className="flex items-center justify-center gap-2 text-blue-700">
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span className="text-sm font-semibold">Ready to generate your virtual try-on!</span>
        </div>
        {selectedGarment && (
          <div className="mt-2 text-center">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
              {selectedGarment.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
