import { Link } from 'react-router-dom';
import { usePlants } from '../../plants/utils/plantsQueries';
import PlantCard from '../../plants/components/PlantCard';
import LoadingSkeleton from '../../plants/components/LoadingSkeleton';

export default function FeaturedPlants() {
  // limit:8 fetches only the first page of 8 plants — no pagination on the landing page.
  // This reuses the same React Query cache key as HomePage when filters are empty.
  const { data, isLoading, isError } = usePlants({ limit: 8 });
  const plants = data?.data.plants ?? [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-2">Our Collection</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Popular picks</h2>
          </div>
          <Link
            to="/plants"
            className="text-sm font-semibold text-green-700 hover:text-green-800 flex items-center gap-1 transition-colors"
          >
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : isError ? (
          <p className="text-center text-gray-400 py-10">Could not load plants right now.</p>
        ) : plants.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No plants available yet.</p>
        ) : (
          // 4-column grid on large screens vs 2 on sm — denser than HomePage (3-col)
          // because the landing page is a showcase rather than a browse interface.
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plants.map((plant) => (
              <PlantCard key={plant._id} plant={plant} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
