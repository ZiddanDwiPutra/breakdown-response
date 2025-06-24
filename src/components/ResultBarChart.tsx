import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, BarChart } from "recharts";

export default function ResultBarChart({parsedJson, tab, availableProps}: any) {
  return (
      <div className="flex-2 min-w-[400px] h-96 md:h-auto"> {/* Increased height for better chart viewing */}
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Form Hasil (Bar Chart)</h3>
        <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm h-full flex items-center justify-center">
          {parsedJson.length > 0 && tab.selectedProps.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={parsedJson}
                margin={{
                  top: 20, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey={availableProps.find((p: string) => ['name', 'category', 'label', 'id'].includes(p)) || availableProps[0] || 'index'} />
                <YAxis />
                <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
                <Legend />
                {tab.selectedProps.map((prop: string) => (
                  <Bar
                    key={prop}
                    dataKey={prop}
                    fill={getRandomColor()}
                    name={prop}
                    animationDuration={300}
                    radius={[4, 4, 0, 0]} // Rounded top corners
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm text-center">
              Masukkan JSON yang valid dan pilih properti untuk menampilkan grafik.
            </p>
          )}
        </div>
      </div>
  )
}

// Helper function to get a random color for chart bars
const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
