import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '../../../store';
import { getWishlist, addToWishlist, removeFromWishlist } from '../utils/wishlistApi';
import type { WishlistPlant, WishlistResponse } from '../types';

export const WISHLIST_QUERY_KEY = 'wishlist';

// Don't fetch for guests — would trigger a 401 and an unnecessary token refresh
export const useWishlist = (page = 1, limit = 9) => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: [WISHLIST_QUERY_KEY, page, limit],
    queryFn: () => getWishlist(page, limit),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// useWishlistIds always fetches page 1 with a large limit to get all IDs for heart-icon lookups.
// Heart icons need to reflect the full wishlist, not just the current page.
export const useWishlistIds = (): Set<string> => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { data } = useQuery({
    queryKey: [WISHLIST_QUERY_KEY, 1, 200],
    queryFn: () => getWishlist(1, 200),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
  const plants = data?.data.plants ?? [];
  return new Set(plants.map((item) => item.plantId._id));
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToWishlist,
    // Optimistic update: fill the heart icon immediately, before the server responds.
    // If the request fails, we roll back to the previous state.
    onMutate: async (plantId: string) => {
      await queryClient.cancelQueries({ queryKey: [WISHLIST_QUERY_KEY] });
      const previous = queryClient.getQueryData<WishlistResponse>([WISHLIST_QUERY_KEY]);
      queryClient.setQueryData<WishlistResponse>([WISHLIST_QUERY_KEY], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            plants: [
              ...old.data.plants,
              // Only _id matters here — the full plant data arrives after the refetch
              { plantId: { _id: plantId } as WishlistPlant },
            ],
          },
        };
      });
      return { previous };
    },
    onError: (_err, _plantId, context) => {
      // Roll back to the saved state if the request failed
      if (context?.previous) {
        queryClient.setQueryData([WISHLIST_QUERY_KEY], context.previous);
      }
    },
    onSettled: () => {
      // Always refetch so we have the full plant data in the cache
      void queryClient.invalidateQueries({ queryKey: [WISHLIST_QUERY_KEY] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlist,
    // Same optimistic pattern as add — empty the heart immediately, roll back on error
    onMutate: async (plantId: string) => {
      await queryClient.cancelQueries({ queryKey: [WISHLIST_QUERY_KEY] });
      const previous = queryClient.getQueryData<WishlistResponse>([WISHLIST_QUERY_KEY]);
      queryClient.setQueryData<WishlistResponse>([WISHLIST_QUERY_KEY], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            plants: old.data.plants.filter(
              (item) => item.plantId._id !== plantId
            ),
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