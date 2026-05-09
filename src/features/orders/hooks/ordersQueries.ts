import { useQuery } from '@tanstack/react-query';
import { getMyOrders, getMyOrderById } from '../utils/ordersApi';

export const ORDERS_QUERY_KEY = 'myOrders';

export const useMyOrders = (page = 1, limit = 10) =>
  useQuery({
    queryKey: [ORDERS_QUERY_KEY, page, limit],
    queryFn: () => getMyOrders(page, limit),
  });

export const useMyOrderById = (id: string) =>
  useQuery({
    queryKey: [ORDERS_QUERY_KEY, id],
    queryFn: () => getMyOrderById(id),
    enabled: !!id,
  });
