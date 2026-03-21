export default function ImageUploadSection({ 
  type, 
  preview, 
  onFileUpload, 
  onStartCamera,
  onRemove,
  fileInputRef 
}) {
  const isFront = type === 'front';
  const label = isFront ? 'Front Image' : 'Side Image';

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors bg-gray-50">
        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt={`${type} view`}
              className="max-h-96 mx-auto rounded-lg shadow-md"
            />
            <button
              onClick={onRemove}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center py-6">
                <svg
                  className="text-gray-400 mb-3 w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-gray-700 font-medium mb-1">
                  Click to upload {isFront ? 'front' : 'side'} image
                </p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                className="hidden"
              />
            </label>
            
            <div className="mt-3 pt-3 border-t border-gray-300">
              <button
                type="button"
                onClick={onStartCamera}
                className="text-sm text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Or take a photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
