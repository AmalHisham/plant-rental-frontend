import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/wishlistQueries';
import PlantCard from '../../plants/components/PlantCard';
import LoadingSkeleton from '../../plants/components/LoadingSkeleton';
import type { PlantCardData } from '../../plants/types';
import BackButton from '../../../components/BackButton';

export default function WishlistPage() {
  const { data, isLoading, isError } = useWishlist();
  // Default to empty array so the empty-state check works without extra null guards.
  const items = data?.data.wishlist.plants ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <BackButton className="mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          {/* Count is only shown after load completes to avoid a jarring "0 plants" flash. */}
          {!isLoading && !isError && (
            <p className="text-gray-500 mt-1 text-sm">
              {items.length} {items.length === 1 ? 'plant' : 'plants'} saved
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSkeleton count={4} />
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg font-medium">Failed to load wishlist</p>
            <p className="text-gray-400 text-sm mt-1">Please try again later</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🤍</div>
            <p className="text-lg font-medium text-gray-600">Your wishlist is empty</p>
            <p className="text-sm mt-1 mb-6">Save plants you like while browsing</p>
            <Link
              to="/"
              className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Browse Plants
            </Link>
          </div>
        ) : (
          // Reuse PlantCard — item.plantId is the populated plant object.
          // Cast to PlantCardData because the wishlist type nests the same fields
          // but under a different interface name.
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <PlantCard
                key={item.plantId._id}
                plant={item.plantId as PlantCardData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
