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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-gray-700 tracking-tight uppercase">
          Garment Library
        </label>
        {garmentPreview && garmentMode === 'default' && (
          <button
            onClick={onClearSelection}
            className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors"
          >
            Clear
          </button>
        )}
      </div>
        
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Category Tabs */}
        <div className="p-2 flex gap-1 bg-gray-50/50 border-b border-gray-100 overflow-x-auto no-scrollbar">
          {Object.keys(defaultGarments).map((cat) => {
            const isDisabled = model === 'hd' && (cat === 'Lower-body' || cat === 'Dresses');
            const isActive = category === cat && garmentMode === 'default';
            
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
                className={`flex-1 min-w-[80px] px-2 py-2 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider ${
                  isDisabled
                    ? 'opacity-30 cursor-not-allowed'
                    : isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-brand-600 hover:bg-white'
                }`}
              >
                {cat.split('-')[0]}
              </button>
            );
          })}
        </div>

        {/* Garments Gallery */}
        <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            {defaultGarments[category]?.map((garment) => {
              const isSelected = garmentPreview === garment.path;
              return (
                <button
                  key={garment.id}
                  onClick={() => onGarmentSelect(garment)}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                      : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }`}
                  disabled={loading}
                >
                  <div className="aspect-square overflow-hidden bg-white">
                    <img
                      src={garment.path}
                      alt="Garment"
                      className={`w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110 ${
                        isSelected ? 'scale-105' : ''
                      }`}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="12" font-weight="600"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  
                  {isSelected && (
                    <div className="absolute inset-0 bg-brand-500/5 flex items-start justify-end p-2">
                      <div className="bg-brand-600 text-white rounded-full p-1 shadow-lg animate-in zoom-in duration-300">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
