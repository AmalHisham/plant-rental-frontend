import { useSearchParams } from 'react-router-dom';
import { usePlants } from '../utils/plantsQueries';
import type { CareLevel, PlantFilters } from '../types';
import PlantCard from './PlantCard';
import PlantFiltersBar from './PlantFilters';
import LoadingSkeleton from './LoadingSkeleton';
import type { PaginationInfo } from '../types';
import Navbar from '../../../components/Navbar';

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  pagination: PaginationInfo;
  params: URLSearchParams;
  setParams: (p: URLSearchParams) => void;
}

function Pagination({ pagination, params, setParams }: PaginationProps) {
  const { page, totalPages } = pagination;

  const goTo = (p: number) => {
    // Clone existing params so active filters aren't lost when changing page.
    const next = new URLSearchParams(params);
    next.set('page', String(p));
    setParams(next);
    // Scroll to top so the user sees the new page from the beginning.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      <button
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
        className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
        className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  // URL search params are the single source of truth for filters.
  // PlantFiltersBar writes them; HomePage reads them to build the API query.
  // This means filter state is bookmarkable and survives a hard refresh.
  const [params, setParams] = useSearchParams();

  // Build a typed filters object from the URL — only include keys that are present
  // so the API query function can skip undefined fields instead of sending ?key=undefined.
  const filters: PlantFilters = {};
  if (params.get('search')) filters.search = params.get('search')!;
  if (params.get('category')) filters.category = params.get('category')!;
  if (params.get('careLevel')) filters.careLevel = params.get('careLevel') as CareLevel;
  // Number() coercion is safe here because the filter bar enforces type="number".
  if (params.get('minPrice')) filters.minPrice = Number(params.get('minPrice'));
  if (params.get('maxPrice')) filters.maxPrice = Number(params.get('maxPrice'));
  if (params.get('page')) filters.page = Number(params.get('page'));

  // usePlants caches per unique filter combination via queryKey = [key, filters].
  const { data, isLoading, isError } = usePlants(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero banner */}
      <div className="bg-white border-b border-gray-200 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Rent a Plant</h1>
          <p className="text-gray-500 mt-1">
            Beautiful plants delivered to your office, event, or studio
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* flex-col on mobile stacks filters above the grid; lg:flex-row puts them side-by-side. */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters — reads and writes the same params as HomePage */}
          <PlantFiltersBar />

          {/* Plant grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              // Skeleton matches the grid layout to avoid layout shifts when data arrives.
              <LoadingSkeleton count={6} />
            ) : isError ? (
              <div className="text-center py-20">
                <p className="text-red-500 text-lg font-medium">Failed to load plants</p>
                <p className="text-gray-400 text-sm mt-1">Please try again later</p>
              </div>
            ) : data?.data.plants.length === 0 ? (
              // Empty state is distinct from error — tells the user to adjust filters, not retry.
              <div className="text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">🪴</div>
                <p className="text-lg font-medium text-gray-600">No plants found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                {/* Total count shown above the grid so the user knows how many results match. */}
                <p className="text-sm text-gray-500 mb-4">
                  {data?.data.pagination.total}{' '}
                  {data?.data.pagination.total === 1 ? 'plant' : 'plants'} found
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.data.plants.map((plant) => (
                    <PlantCard key={plant._id} plant={plant} />
                  ))}
                </div>

                {/* Pagination only rendered when there's more than one page to navigate. */}
                {data && data.data.pagination.totalPages > 1 && (
                  <Pagination
                    pagination={data.data.pagination}
                    params={params}
                    setParams={setParams}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
