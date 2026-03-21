import { defaultGarments } from '../../services/defaultGarments';

export default function GarmentGallery({ 
  category, 
  setCategory, 
  garmentPreview, 
  onGarmentSelect, 
  onClearSelection, 
  loading,
  garmentMode,
  setGarmentMode,
  model
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Choose from Default Garments
      </label>
        
        <div className="border-2 border-gray-300 rounded-xl bg-white overflow-hidden">
          {/* Category Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {Object.keys(defaultGarments).map((cat) => {
              const isDisabled = model === 'hd' && (cat === 'Lower-body' || cat === 'Dresses');
              return (
                <button
                  key={cat}
                  onClick={() => {
                    if (!isDisabled) {
                      setCategory(cat);
                      setGarmentMode('default');
                    }
                  }}
                  disabled={isDisabled}
                  className={`flex-1 px-3 py-3 text-xs font-medium transition-all ${
                    isDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : category === cat && garmentMode === 'default'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.replace('-', ' ')}
                </button>
              );
            })}
          </div>

          {/* Garments Gallery */}
          <div className="p-3 max-h-[600px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {defaultGarments[category]?.map((garment) => (
                <button
                  key={garment.id}
                  onClick={() => onGarmentSelect(garment)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                    garmentPreview === garment.path
                      ? 'border-gray-900 ring-2 ring-gray-900'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  disabled={loading}
                >
                  <img
                    src={garment.path}
                    alt="Garment"
                    className="w-full h-28 object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {garmentPreview === garment.path && (
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
        
        {garmentPreview && garmentMode === 'default' && (
          <button
            onClick={onClearSelection}
            className="w-full mt-3 px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear Selection
          </button>
        )}
    </div>
  );
}
