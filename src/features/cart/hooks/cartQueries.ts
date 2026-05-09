import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '../../../store';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../utils/cartApi';
import type { UpdateCartItemRequest } from '../types';

export const CART_QUERY_KEY = 'cart';

export const useCart = () => {
  // Don't fetch for guests — would trigger a 401 and then an unnecessary token refresh
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: [CART_QUERY_KEY],
    queryFn: getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes — mutations refresh the cache anyway
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    // Refresh on both success and error so the cart is always up to date
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ plantId, data }: { plantId: string; data: UpdateCartItemRequest }) =>
      updateCartItem({ plantId, data }),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromCart,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] });
    },
  });
};