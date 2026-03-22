export default function ImageUpload({ type, preview, onImageChange, onRemove }) {
  const isPerson = type === 'person';

  return (
    <div className="flex-1">
      <label className="block text-sm font-bold text-gray-700 mb-3 tracking-tight">
        {isPerson ? 'Your Photo' : 'Custom Garment'}
      </label>
      <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-300 min-h-[320px] flex flex-col items-center justify-center bg-gray-50/50 ${
        preview ? 'border-brand-100 bg-white' : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50/30'
      }`}>
        {preview ? (
          <div className="relative group w-full h-full flex flex-col items-center">
            <img
              src={preview}
              alt={type}
              className="max-h-[280px] w-auto rounded-xl shadow-sm object-contain"
            />
            <button
              onClick={onRemove}
              className="mt-3 px-4 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
            >
              Change Image
            </button>
          </div>
        ) : (
          <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-8">
            {/* Ghost Illustration */}
            <div className="relative mb-4 opacity-40 group-hover:opacity-60 transition-opacity">
              {isPerson ? (
                <svg className="w-20 h-20 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  <path strokeDasharray="2 2" strokeLinecap="round" strokeWidth={1} d="M12 2v2m0 16v2m10-10h-2M4 12H2" />
                </svg>
              ) : (
                <svg className="w-20 h-20 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                  <rect x="6" y="8" width="12" height="10" rx="2" strokeDasharray="2 2" strokeWidth={1} />
                </svg>
              )}
            </div>

            <div className="text-center px-4">
              <p className="text-sm font-bold text-gray-900 mb-1">
                {isPerson ? 'Upload Your Portrait' : 'Upload Flat-lay Item'}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                Drag & drop or click to browse
              </p>
            </div>
            
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
