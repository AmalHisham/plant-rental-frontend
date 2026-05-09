interface Props {
  open: boolean;        // whether the dialog is visible
  title: string;        // heading text (e.g. "Delete Plant?")
  message: string;      // body text (e.g. "This cannot be undone.")
  confirmLabel?: string; // confirm button text — defaults to "Delete"
  isLoading?: boolean;  // disables buttons and shows spinner while true
  onConfirm: () => void; // called when user clicks the confirm button
  onCancel: () => void;  // called when user clicks Cancel or the backdrop
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  isLoading = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null; // don't render anything if dialog is closed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => { if (!isLoading) onCancel(); }}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{message}</p>

        <div className="mt-5 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {/* show spinner inside button while loading */}
            {isLoading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
