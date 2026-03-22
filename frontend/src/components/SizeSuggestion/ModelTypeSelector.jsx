export default function ModelTypeSelector({ modelType, setModelType }) {
  const models = [
    {
      id: 'decision_tree',
      name: 'Quick Suggestion',
      description: 'Fast results based on trend data.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'neural_network',
      name: 'Deep Analysis',
      description: 'Advanced AI pattern matching.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-700 tracking-tight">
        Analysis Method
      </label>
      <div className="flex flex-col sm:flex-row gap-4">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => setModelType(model.id)}
            className={`flex-1 p-5 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${
              modelType === model.id
                ? 'border-brand-600 bg-brand-50 shadow-sm'
                : 'border-gray-100 bg-white hover:border-brand-200 hover:bg-gray-50'
            }`}
          >
            <div className={`p-2 rounded-xl ${
              modelType === model.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {model.icon}
            </div>
            <div>
              <div className={`font-bold text-sm mb-0.5 ${
                modelType === model.id ? 'text-brand-900' : 'text-gray-900'
              }`}>
                {model.name}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {model.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
