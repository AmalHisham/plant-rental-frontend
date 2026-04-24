function SkeletonCard() {
  // Mirror the card layout so loading states do not jump around.
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden animate-pulse bg-white">
      <div className="bg-gray-200 h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 rounded-full w-16" />
        </div>
        <div className="flex justify-between items-end pt-1">
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

interface Props {
  count?: number;
}

export default function LoadingSkeleton({ count = 6 }: Props) {
  // Render enough placeholders to fill the visible grid.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
