export default function ModelTypeSelector({ modelType, setModelType }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Prediction Model
      </label>
      <div className="flex gap-4">
        <button
          onClick={() => setModelType('decision_tree')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
            modelType === 'decision_tree'
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Decision Tree
        </button>
        <button
          onClick={() => setModelType('neural_network')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
            modelType === 'neural_network'
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Neural Network
        </button>
      </div>
    </div>
  );
}
