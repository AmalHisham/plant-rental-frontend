import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminDashboard,
  getAdminOrders,
  updateOrderStatus,
  updateOrderDamage,
  updateOrderDeposit,
  createPlant,
  updatePlant,
  deletePlant,
  uploadPlantImages,
  deletePlantImage,
  getAdminUsers,
  toggleUserStatus,
  deleteUser,
  createAdmin,
} from '../utils/adminApi';
import { getAllPlants } from '../../plants/utils/plantsApi';
import { PLANTS_QUERY_KEY } from '../../plants/hooks/plantsQueries';
import type {
  AdminOrdersFilters,
  UpdateOrderStatusRequest,
  UpdateOrderDamageRequest,
  UpdateOrderDepositRequest,
  AdminPlantsFilters,
  CreatePlantRequest,
  UpdatePlantRequest,
  AdminUsersFilters,
  ToggleUserStatusRequest,
  CreateAdminRequest,
} from '../types';

export const ADMIN_DASHBOARD_KEY = 'adminDashboard';
export const ADMIN_ORDERS_KEY = 'adminOrders';
export const ADMIN_USERS_KEY = 'adminUsers';

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const useAdminDashboard = () =>
  useQuery({
    queryKey: [ADMIN_DASHBOARD_KEY],
    queryFn: getAdminDashboard,
    staleTime: 1000 * 60 * 2,
  });

// ─── Admin Orders ─────────────────────────────────────────────────────────────

export const useAdminOrders = (filters?: AdminOrdersFilters) =>
  useQuery({
    queryKey: [ADMIN_ORDERS_KEY, filters],
    queryFn: () => getAdminOrders(filters),
  });

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateOrderStatusRequest }) =>
      updateOrderStatus(id, body),
    onSettled: () => void qc.invalidateQueries({ queryKey: [ADMIN_ORDERS_KEY] }),
  });
};

export const useUpdateOrderDamage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateOrderDamageRequest }) =>
      updateOrderDamage(id, body),
    onSettled: () => void qc.invalidateQueries({ queryKey: [ADMIN_ORDERS_KEY] }),
  });
};

export const useUpdateOrderDeposit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateOrderDepositRequest }) =>
      updateOrderDeposit(id, body),
    onSettled: () => void qc.invalidateQueries({ queryKey: [ADMIN_ORDERS_KEY] }),
  });
};

// ─── Plants ───────────────────────────────────────────────────────────────────
// Reads reuse PLANTS_QUERY_KEY + getAllPlants so admin mutations also refresh
// the public browse page cache automatically.

export const useAdminPlants = (filters?: AdminPlantsFilters) =>
  useQuery({
    queryKey: [PLANTS_QUERY_KEY, filters],
    queryFn: () => getAllPlants(filters),
  });

export const useCreatePlant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePlantRequest) => createPlant(body),
    onSettled: () => void qc.invalidateQueries({ queryKey: [PLANTS_QUERY_KEY] }),
  });
};

export const useUpdatePlant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdatePlantRequest }) => updatePlant(id, body),
    onSettled: () => void qc.invalidateQueries({ queryKey: [PLANTS_QUERY_KEY] }),
  });
};

export const useDeletePlant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePlant(id),
    onSettled: () => void qc.invalidateQueries({ queryKey: [PLANTS_QUERY_KEY] }),
  });
};

export const useUploadPlantImages = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) => uploadPlantImages(id, files),
    onSettled: () => void qc.invalidateQueries({ queryKey: [PLANTS_QUERY_KEY] }),
  });
};

export const useDeletePlantImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, imageUrl }: { id: string; imageUrl: string }) => deletePlantImage(id, imageUrl),
    onSettled: () => void qc.invalidateQueries({ queryKey: [PLANTS_QUERY_KEY] }),
  });
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const useAdminUsers = (filters?: AdminUsersFilters) =>
  useQuery({
    queryKey: [ADMIN_USERS_KEY, filters],
    queryFn: () => getAdminUsers(filters),
  });

export const useToggleUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ToggleUserStatusRequest }) =>
      toggleUserStatus(id, body),
    onSettled: () => void qc.invalidateQueries({ queryKey: [ADMIN_USERS_KEY] }),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSettled: () => void qc.invalidateQueries({ queryKey: [ADMIN_USERS_KEY] }),
  });
};

export const useCreateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAdminRequest) => createAdmin(body),
    onSettled: () => void qc.invalidateQueries({ queryKey: [ADMIN_USERS_KEY] }),
  });
};
