export default function DefaultSection({title, children}: any) {
  return (
    <div className="flex-1 min-w-[300px]">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title || 'Result'}</h3>
      <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
        {children}  
      </div>
    </div>
  )
}