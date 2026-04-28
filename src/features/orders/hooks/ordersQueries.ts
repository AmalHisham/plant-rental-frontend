import { useQuery } from '@tanstack/react-query';
import { getMyOrders, getMyOrderById } from '../utils/ordersApi';

export const ORDERS_QUERY_KEY = 'myOrders';

export const useMyOrders = () =>
  useQuery({
    queryKey: [ORDERS_QUERY_KEY],
    queryFn: getMyOrders,
  });

export const useMyOrderById = (id: string) =>
  useQuery({
    queryKey: [ORDERS_QUERY_KEY, id],
    queryFn: () => getMyOrderById(id),
    enabled: !!id,
  });
