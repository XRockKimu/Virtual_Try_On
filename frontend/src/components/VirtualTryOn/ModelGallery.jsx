import { defaultModels } from '../../services/defaultModels';

export default function ModelGallery({ 
  personPreview, 
  onModelSelect, 
  onClearSelection, 
  loading 
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Choose Default Model
      </label>
        
        <div className="border-2 border-gray-300 rounded-xl bg-white overflow-hidden">
          {/* Models Gallery */}
          <div className="p-3 max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {defaultModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => onModelSelect(model)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                    personPreview === model.path
                      ? 'border-gray-900 ring-2 ring-gray-900'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  disabled={loading}
                >
                  <img
                    src={model.path}
                    alt={model.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {personPreview === model.path && (
                    <div className="absolute top-1 right-1 bg-gray-900 text-white rounded-full p-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {personPreview && (
          <button
            onClick={onClearSelection}
            className="w-full mt-3 px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear Model
          </button>
        )}
    </div>
  );
}
