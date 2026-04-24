import axiosInstance from '../../../api/axiosInstance';
import type { CartResponse, AddToCartRequest, UpdateCartItemRequest } from '../types';

// All cart operations use the shared authenticated axios client so the
// request interceptor automatically injects the Authorization header.

export const getCart = (): Promise<CartResponse> =>
  axiosInstance.get('/api/cart').then((r) => r.data);

export const addToCart = (data: AddToCartRequest): Promise<CartResponse> =>
  axiosInstance.post('/api/cart/items', data).then((r) => r.data);

// plantId in the path identifies which item to update (the backend uses it to match
// the items array element by its embedded plantId).
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

// clearCart empties all items but keeps the cart document — the backend returns
// a message instead of the cart because the cart is now empty.
export const clearCart = (): Promise<{ success: true; message: string }> =>
  axiosInstance.delete('/api/cart').then((r) => r.data);
