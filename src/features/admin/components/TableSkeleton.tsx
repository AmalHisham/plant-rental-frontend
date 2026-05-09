interface Props {
  rows?: number; // number of fake rows to show (default 5)
  cols?: number; // number of fake columns to show (default 5)
}

export default function TableSkeleton({ rows = 5, cols = 5 }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {/* render fake header cells */}
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20" /> {/* pulsing gray bar */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* render fake rows */}
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri} className="border-b border-gray-50">
              {/* render fake cells with varying widths so it looks natural */}
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
