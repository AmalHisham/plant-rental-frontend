import axiosInstance from '../../../api/axiosInstance';
import type { OrdersResponse, OrderResponse } from '../types';

export const getMyOrders = (): Promise<OrdersResponse> =>
  axiosInstance.get('/api/orders').then((r) => r.data);

export const getMyOrderById = (id: string): Promise<OrderResponse> =>
  axiosInstance.get(`/api/orders/${id}`).then((r) => r.data);
