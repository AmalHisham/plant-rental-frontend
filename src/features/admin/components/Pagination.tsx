interface Props {
  page: number;                          // current active page number
  totalPages: number;                    // total number of pages available
  onPageChange: (page: number) => void;  // fires with page-1 or page+1 when Prev/Next clicked
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null; // no point showing pagination if everything fits on one page

  return (
    <div className="flex items-center justify-between px-1 pt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ← Previous
      </button>
      <span className="text-sm text-gray-500">
        Page <span className="font-semibold text-gray-800">{page}</span> of{' '}
        <span className="font-semibold text-gray-800">{totalPages}</span>
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  );
}
