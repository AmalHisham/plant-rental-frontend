import axiosInstance from '../../../api/axiosInstance';
import type { WishlistResponse } from '../types';

export const getWishlist = (): Promise<WishlistResponse> =>
  axiosInstance.get<WishlistResponse>('/api/wishlist').then((r) => r.data);

// Plant ID goes in the URL path, not the request body
export const addToWishlist = (plantId: string): Promise<WishlistResponse> =>
  axiosInstance.post<WishlistResponse>(`/api/wishlist/${plantId}`).then((r) => r.data);

export const removeFromWishlist = (plantId: string): Promise<WishlistResponse> =>
  axiosInstance.delete<WishlistResponse>(`/api/wishlist/${plantId}`).then((r) => r.data);
