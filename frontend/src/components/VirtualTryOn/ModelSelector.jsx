export default function ModelSelector({ model, setModel }) {
  const modelOptions = [
    { id: 'hd', name: 'HD Model', description: 'Train on - VITON HD' },
    { id: 'dc', name: 'DC Model', description: 'Train on - Dress Code' },
    { id: 'gemini', name: 'Google Vertex AI', description: 'AI-powered results' }
  ];

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Select Model
      </label>
      <div className="grid grid-cols-3 gap-3">
        {modelOptions.map((modelOption) => (
          <button
            key={modelOption.id}
            onClick={() => setModel(modelOption.id)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              model === modelOption.id
                ? 'border-gray-900 bg-gray-50 shadow-md'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="font-semibold text-gray-800 text-sm mb-1">{modelOption.name}</div>
            <div className="text-xs text-gray-600">{modelOption.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
