export default function MeasurementForm({ measurements, onInputChange, onCalculate }) {
  const fields = [
    { key: 'chest', label: 'Chest', required: true, placeholder: 'e.g., 92' },
    { key: 'waist', label: 'Waist', required: true, placeholder: 'e.g., 76' },
    { key: 'hips', label: 'Hips', required: true, placeholder: 'e.g., 95' },
    { key: 'shoulder', label: 'Shoulder', required: false, placeholder: 'e.g., 42' },
    { key: 'sleeve', label: 'Sleeve', required: false, placeholder: 'e.g., 60' },
    { key: 'inseam', label: 'Inseam', required: false, placeholder: 'e.g., 78' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {field.label} (cm) {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              value={measurements[field.key]}
              onChange={(e) => onInputChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onCalculate}
          className="px-12 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
        >
          Calculate Size
        </button>
      </div>
    </div>
  );
}
