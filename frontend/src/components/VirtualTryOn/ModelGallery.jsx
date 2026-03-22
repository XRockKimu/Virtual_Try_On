import { defaultModels } from '../../services/defaultModels';

export default function ModelGallery({ 
  personPreview, 
  onModelSelect, 
  onClearSelection, 
  loading 
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-gray-700 tracking-tight uppercase">
          Select Base Model
        </label>
        {personPreview && (
          <button
            onClick={onClearSelection}
            className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors"
          >
            Clear
          </button>
        )}
      </div>
        
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Models Gallery */}
        <div className="p-4 max-h-[380px] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            {defaultModels.map((model) => {
              const isSelected = personPreview === model.path;
              return (
                <button
                  key={model.id}
                  onClick={() => onModelSelect(model)}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                      : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }`}
                  disabled={loading}
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={model.path}
                      alt={model.name}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                        isSelected ? 'scale-105' : ''
                      }`}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="12" font-weight="600"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  
                  {/* Selection Overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-brand-500/10 flex items-start justify-end p-2">
                      <div className="bg-brand-600 text-white rounded-full p-1 shadow-lg animate-in zoom-in duration-300">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Hover Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-bold text-white truncate">{model.name}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
