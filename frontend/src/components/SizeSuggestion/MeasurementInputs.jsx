export default function MeasurementInputs({ age, setAge, height, setHeight, weight, setWeight }) {
  const inputFields = [
    { 
      id: 'age', 
      label: 'Age', 
      unit: 'yrs', 
      value: age, 
      setter: setAge, 
      placeholder: '25',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'height', 
      label: 'Height', 
      unit: 'cm', 
      value: height, 
      setter: setHeight, 
      placeholder: '170',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    { 
      id: 'weight', 
      label: 'Weight', 
      unit: 'kg', 
      value: weight, 
      setter: setWeight, 
      placeholder: '65',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {inputFields.map((field) => (
        <div key={field.id} className="space-y-2 group">
          <label className="block text-sm font-bold text-gray-700 tracking-tight transition-colors group-focus-within:text-brand-600">
            {field.label} <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest ml-1">{field.unit}</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-500 transition-colors">
              {field.icon}
            </div>
            <input
              type="number"
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
              className="w-full pl-11 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
