interface Props {
  rows?: number;
  cols?: number;
}

export default function TableSkeleton({ rows = 5, cols = 5 }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri} className="border-b border-gray-50">
              {Array.from({ length: cols }).map((_, ci) => (
                <td key={ci} className="px-4 py-3">
                  <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + (ci % 3) * 20}%` }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
