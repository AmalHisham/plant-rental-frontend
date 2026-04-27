import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '../../../store';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../utils/cartApi';
import type { UpdateCartItemRequest } from '../types';

export const CART_QUERY_KEY = 'cart';

export const useCart = () => {
  // Cart requires authentication — enabled: false skips the query for guests
  // (avoids a 401 that would trigger the refresh/logout interceptor loop).
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: [CART_QUERY_KEY],
    queryFn: getCart,
    enabled: isAuthenticated,
    // 2-minute staleTime — cart data changes often (mutations invalidate immediately anyway),
    // but a short window prevents unnecessary refetches on rapid tab switches.
    staleTime: 1000 * 60 * 2,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    // onSettled fires after both success and error — ensures the cache is invalidated
    // even if the mutation fails (e.g., stock ran out between button click and request).
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // Unwrap the compound arg so callers pass { plantId, data } as a single object.
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