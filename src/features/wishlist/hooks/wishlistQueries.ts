import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '../../../store';
import { getWishlist, addToWishlist, removeFromWishlist } from '../utils/wishlistApi';
import type { WishlistPlant, WishlistResponse } from '../types';

export const WISHLIST_QUERY_KEY = 'wishlist';

// Fetch only for authenticated users — avoids a 401 that would trigger the
// refresh interceptor loop for guests browsing the homepage.
export const useWishlist = () => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: [WISHLIST_QUERY_KEY],
    queryFn: getWishlist,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,  // 5 min — wishlist changes infrequently, mutations invalidate anyway
  });
};

// Derived hook that exposes a Set<string> of wishlisted plant IDs.
// A Set provides O(1) .has() lookup so every PlantCard heart icon check is fast,
// even when rendering grids of 50+ cards simultaneously.
export const useWishlistIds = (): Set<string> => {
  const { data } = useWishlist();
  const plants = data?.data.wishlist.plants ?? [];
  return new Set(plants.map((item) => item.plantId._id));
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToWishlist,
    // Optimistic update: the heart fills instantly without waiting for the server.
    // Steps: cancel in-flight refetch → snapshot old state → apply optimistic change.
    onMutate: async (plantId: string) => {
      await queryClient.cancelQueries({ queryKey: [WISHLIST_QUERY_KEY] });
      const previous = queryClient.getQueryData<WishlistResponse>([WISHLIST_QUERY_KEY]);
      queryClient.setQueryData<WishlistResponse>([WISHLIST_QUERY_KEY], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            wishlist: {
              ...old.data.wishlist,
              plants: [
                ...old.data.wishlist.plants,
                // Only _id is needed for the Set membership check — full plant
                // data arrives after onSettled re-fetches from the server.
                { plantId: { _id: plantId } as WishlistPlant },
              ],
            },
          },
        };
      });
      return { previous };
    },
    // Roll back the optimistic update if the request fails.
    onError: (_err, _plantId, context) => {
      if (context?.previous) {
        queryClient.setQueryData([WISHLIST_QUERY_KEY], context.previous);
      }
    },
    // Always refetch after settle so the full populated plant data is in cache.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: [WISHLIST_QUERY_KEY] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlist,
    // Same optimistic pattern as add — heart empties immediately, rolls back on error.
    onMutate: async (plantId: string) => {
      await queryClient.cancelQueries({ queryKey: [WISHLIST_QUERY_KEY] });
      const previous = queryClient.getQueryData<WishlistResponse>([WISHLIST_QUERY_KEY]);
      queryClient.setQueryData<WishlistResponse>([WISHLIST_QUERY_KEY], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            wishlist: {
              ...old.data.wishlist,
              plants: old.data.wishlist.plants.filter(
                (item) => item.plantId._id !== plantId
              ),
            },
          },
        };
      });
      return { previous };
    },
    onError: (_err, _plantId, context) => {
      if (context?.previous) {
        queryClient.setQueryData([WISHLIST_QUERY_KEY], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: [WISHLIST_QUERY_KEY] });
    },
  });
};