import axiosInstance from '../../../api/axiosInstance';
import type { WishlistResponse } from '../types';

// All wishlist operations use the shared authenticated axios client so the
// Authorization header is injected automatically by the request interceptor.

export const getWishlist = (): Promise<WishlistResponse> =>
  axiosInstance.get<WishlistResponse>('/api/wishlist').then((r) => r.data);

// Add and remove use the plantId as a path param (not a request body) — mirrors
// the backend route design where POST/DELETE /:plantId are the endpoints.
export const addToWishlist = (plantId: string): Promise<WishlistResponse> =>
  axiosInstance
    .post<WishlistResponse>(`/api/wishlist/${plantId}`)
    .then((r) => r.data);

export const removeFromWishlist = (plantId: string): Promise<WishlistResponse> =>
  axiosInstance
    .delete<WishlistResponse>(`/api/wishlist/${plantId}`)
    .then((r) => r.data);
