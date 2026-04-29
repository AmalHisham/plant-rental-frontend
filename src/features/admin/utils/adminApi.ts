import axiosInstance from '../../../api/axiosInstance';
import type {
  DashboardResponse,
  AdminOrdersFilters,
  AdminOrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderDamageRequest,
  UpdateOrderDepositRequest,
  CreatePlantRequest,
  UpdatePlantRequest,
  AdminPlantResponse,
  AdminUsersFilters,
  AdminUsersResponse,
  AdminUserResponse,
  ToggleUserStatusRequest,
  CreateAdminRequest,
  AdminMessageResponse,
} from '../types';

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const getAdminDashboard = (): Promise<DashboardResponse> =>
  axiosInstance.get('/api/admin/dashboard').then((r) => r.data);

// ─── Admin Orders ─────────────────────────────────────────────────────────────

export const getAdminOrders = (filters?: AdminOrdersFilters): Promise<AdminOrdersResponse> =>
  axiosInstance.get('/api/admin/orders', { params: filters }).then((r) => r.data);

export const updateOrderStatus = (
  id: string,
  body: UpdateOrderStatusRequest,
): Promise<AdminMessageResponse> =>
  axiosInstance.patch(`/api/orders/${id}/status`, body).then((r) => r.data);

export const updateOrderDamage = (
  id: string,
  body: UpdateOrderDamageRequest,
): Promise<AdminMessageResponse> =>
  axiosInstance.patch(`/api/orders/${id}/damage`, body).then((r) => r.data);

export const updateOrderDeposit = (
  id: string,
  body: UpdateOrderDepositRequest,
): Promise<AdminMessageResponse> =>
  axiosInstance.patch(`/api/orders/${id}/deposit`, body).then((r) => r.data);

// ─── Plants ───────────────────────────────────────────────────────────────────
// Plant reads reuse getAllPlants from plantsApi.ts (public GET endpoint).
// Only write operations are defined here.

export const createPlant = (body: CreatePlantRequest): Promise<AdminPlantResponse> =>
  axiosInstance.post('/api/plants', body).then((r) => r.data);

export const updatePlant = (id: string, body: UpdatePlantRequest): Promise<AdminPlantResponse> =>
  axiosInstance.put(`/api/plants/${id}`, body).then((r) => r.data);

export const deletePlant = (id: string): Promise<AdminMessageResponse> =>
  axiosInstance.delete(`/api/plants/${id}`).then((r) => r.data);

// FormData upload — axiosInstance sends multipart/form-data automatically when
// the body is a FormData object (browser sets the Content-Type with boundary).
export const uploadPlantImages = (id: string, files: File[]): Promise<AdminPlantResponse> => {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));
  return axiosInstance.post(`/api/plants/${id}/images`, form).then((r) => r.data);
};

export const deletePlantImage = (id: string, imageUrl: string): Promise<AdminPlantResponse> =>
  axiosInstance.delete(`/api/plants/${id}/images`, { data: { imageUrl } }).then((r) => r.data);

// ─── Users ────────────────────────────────────────────────────────────────────

export const getAdminUsers = (filters?: AdminUsersFilters): Promise<AdminUsersResponse> =>
  axiosInstance.get('/api/users', { params: filters }).then((r) => r.data);

export const getAdminUser = (id: string): Promise<AdminUserResponse> =>
  axiosInstance.get(`/api/users/${id}`).then((r) => r.data);

export const toggleUserStatus = (
  id: string,
  body: ToggleUserStatusRequest,
): Promise<AdminUserResponse> =>
  axiosInstance.patch(`/api/users/${id}/status`, body).then((r) => r.data);

export const deleteUser = (id: string): Promise<AdminMessageResponse> =>
  axiosInstance.delete(`/api/users/${id}`).then((r) => r.data);

// ─── Admin provisioning ───────────────────────────────────────────────────────

export const createAdmin = (body: CreateAdminRequest): Promise<AdminMessageResponse> =>
  axiosInstance.post('/api/admin/create-admin', body).then((r) => r.data);
