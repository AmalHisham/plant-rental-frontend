import axiosInstance from '../../../api/axiosInstance';
import type { CartResponse, AddToCartRequest, UpdateCartItemRequest } from '../types';

export const getCart = (): Promise<CartResponse> =>
  axiosInstance.get('/api/cart').then((r) => r.data);

export const addToCart = (data: AddToCartRequest): Promise<CartResponse> =>
  axiosInstance.post('/api/cart/items', data).then((r) => r.data);

// plantId in the URL tells the backend which cart item to update
export const updateCartItem = ({
  plantId,
  data,
}: {
  plantId: string;
  data: UpdateCartItemRequest;
}): Promise<CartResponse> =>
  axiosInstance.put(`/api/cart/items/${plantId}`, data).then((r) => r.data);

export const removeFromCart = (plantId: string): Promise<CartResponse> =>
  axiosInstance.delete(`/api/cart/items/${plantId}`).then((r) => r.data);

// Removes all items — backend returns a message (not the empty cart)
export const clearCart = (): Promise<{ success: true; message: string }> =>
  axiosInstance.delete('/api/cart').then((r) => r.data);
