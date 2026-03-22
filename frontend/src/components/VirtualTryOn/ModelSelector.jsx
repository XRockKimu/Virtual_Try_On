export default function ModelSelector({ model, setModel }) {
  const modelOptions = [
    { 
      id: 'hd', 
      name: 'Studio Quality', 
      description: 'High-definition (HD) results',
      badge: 'Best Visuals'
    },
    { 
      id: 'dc', 
      name: 'Standard Fit', 
      description: 'Balanced for all body types',
      badge: 'Most Reliable'
    },
    { 
      id: 'gemini', 
      name: 'AI Enhanced', 
      description: 'Google Vertex AI powered',
      badge: 'Experimental'
    }
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-700 tracking-tight">
        Processing Engine
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {modelOptions.map((modelOption) => (
          <button
            key={modelOption.id}
            onClick={() => setModel(modelOption.id)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between h-full ${
              model === modelOption.id
                ? 'border-brand-600 bg-brand-50 shadow-sm ring-1 ring-brand-600'
                : 'border-gray-100 bg-white hover:border-brand-200 hover:bg-gray-50'
            }`}
          >
            {modelOption.badge && (
              <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                model === modelOption.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {modelOption.badge}
              </span>
            )}
            <div>
              <div className={`font-bold text-sm mb-1 ${
                model === modelOption.id ? 'text-brand-900' : 'text-gray-900'
              }`}>
                {modelOption.name}
              </div>
              <div className="text-xs text-gray-500 leading-relaxed font-medium">
                {modelOption.description}
              </div>
            </div>
            
            {/* Selection indicator */}
            <div className={`mt-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
              model === modelOption.id ? 'border-brand-600 bg-brand-600' : 'border-gray-200'
            }`}>
              {model === modelOption.id && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
