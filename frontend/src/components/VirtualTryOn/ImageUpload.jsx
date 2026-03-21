export default function ImageUpload({ type, preview, onImageChange, onRemove }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {type === 'person' ? 'Person Image' : 'Custom Garment'}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors bg-gray-50">
        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt={type}
              className={`mx-auto rounded-lg shadow-md`}
            />
            <button
              onClick={onRemove}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="cursor-pointer block">
            <div className={`flex flex-col items-center py-6`}>
              <svg
                className={`text-gray-400 mb-3 w-16 h-16`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {type === 'person' ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                )}
              </svg>
              <p className="text-gray-700 font-medium mb-1">
                {type === 'person' ? 'Click to upload person image' : 'Upload your own garment'}
              </p>
              <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
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
