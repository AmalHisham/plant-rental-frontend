import axiosInstance from '../../../api/axiosInstance';
import type { OrdersResponse, OrderResponse } from '../types';

export const getMyOrders = (page = 1, limit = 10): Promise<OrdersResponse> =>
  axiosInstance.get('/api/orders', { params: { page, limit } }).then((r) => r.data);

export const getMyOrderById = (id: string): Promise<OrderResponse> =>
  axiosInstance.get(`/api/orders/${id}`).then((r) => r.data);
