export default function ConfigProps({tab, availableProps, onConfigChange}: any) {
  const handleConfigCheckboxChange = (prop: string): void => {
    const newSelectedProps = tab.selectedProps.includes(prop)
      ? tab.selectedProps.filter((p: any) => p !== prop)
      : [...tab.selectedProps, prop];
    onConfigChange(tab.id, newSelectedProps);
  };
  return (
    <div className="flex-1 min-w-[300px]">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">Select Property for calcution</h3>
      <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm h-64 overflow-y-auto">
        {availableProps.length > 0 ? (
          availableProps.map((prop: string) => (
            <div key={prop} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`prop-${tab.id}-${prop}`}
                name={prop}
                checked={tab.selectedProps.includes(prop)}
                onChange={() => handleConfigCheckboxChange(prop)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`prop-${tab.id}-${prop}`} className="ml-2 text-gray-700 text-sm">
                {prop}
              </label>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">
            Tidak ada properti yang tersedia. Masukkan JSON array objek yang valid di form input JSON.
          </p>
        )}
      </div>
    </div>
  )
}

export interface Parent {
	arr: {
		a: number;
	}[];
	arr2: {
		price: number;
	}[];
}