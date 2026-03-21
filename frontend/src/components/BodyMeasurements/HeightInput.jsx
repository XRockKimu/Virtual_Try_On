export default function HeightInput({ height, setHeight }) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Height (cm)
      </label>
      <input
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        placeholder="e.g., 170"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
        min="100"
        max="250"
        step="0.1"
      />
    </div>
  );
}
