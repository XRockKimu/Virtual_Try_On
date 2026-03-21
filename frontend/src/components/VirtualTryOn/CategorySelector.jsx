export default function CategorySelector({ category, setCategory }) {
  const categories = ['Upper-body', 'Lower-body', 'Dresses'];

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Garment Category
      </label>
      <div className="flex gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
              category === cat
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
