export default function ImageUploadSection({ 
  type, 
  preview, 
  onFileUpload, 
  onStartCamera,
  onRemove,
  fileInputRef 
}) {
  const isFront = type === 'front';
  const label = isFront ? 'Front Profile' : 'Side Profile';

  return (
    <div className="flex-1">
      <label className="block text-sm font-bold text-gray-700 mb-3 tracking-tight">
        {label}
      </label>
      <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-300 min-h-[340px] flex flex-col items-center justify-center bg-gray-50/50 ${
        preview ? 'border-brand-100 bg-white' : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50/30'
      }`}>
        {preview ? (
          <div className="relative group w-full h-full flex flex-col items-center">
            <img
              src={preview}
              alt={`${type} view`}
              className="max-h-[300px] w-auto rounded-xl shadow-sm object-contain"
            />
            <button
              onClick={onRemove}
              className="mt-3 px-4 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
            >
              Retake Photo
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-6">
            <label className="cursor-pointer w-full flex flex-col items-center justify-center mb-4 group">
              {/* Ghost Illustration */}
              <div className="relative mb-6 opacity-30 group-hover:opacity-50 transition-opacity">
                {isFront ? (
                  <svg className="w-24 h-24 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    <path strokeDasharray="3 3" strokeLinecap="round" strokeWidth={1} d="M12 2v20M2 12h20" className="opacity-40" />
                  </svg>
                ) : (
                  <svg className="w-24 h-24 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" transform="rotate(-15 12 12)" />
                    <path strokeDasharray="3 3" strokeLinecap="round" strokeWidth={1} d="M12 2v20M2 12h20" className="opacity-40" />
                  </svg>
                )}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                  {isFront ? 'Front View' : 'Side View'}
                </div>
              </div>

              <div className="text-center px-4">
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Upload {label}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  PNG, JPG up to 10MB
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                className="hidden"
              />
            </label>
            
            <div className="w-full max-w-[200px] pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onStartCamera}
                className="w-full py-2.5 bg-white border border-gray-200 text-xs font-bold text-gray-600 rounded-xl hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Open Camera
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
