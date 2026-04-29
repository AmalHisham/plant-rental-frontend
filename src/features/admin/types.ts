import type { CareLevel } from '../plants/types';
import type { OrderStatus, DamageStatus, PaymentStatus } from '../orders/types';
import type { UserRole } from '../auth/types';

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardOrdersByStatus {
  booked: number;
  delivered: number;
  picked: number;
}

export interface DashboardRecentOrderItem {
  plantId: { name: string; category: string };
  quantity: number;
}

export interface DashboardRecentOrderUser {
  name: string;
  email: string;
}

export interface DashboardRecentOrder {
  _id: string;
  userId: DashboardRecentOrderUser;
  plants: DashboardRecentOrderItem[];
  rentalStartDate: string;
  rentalEndDate: string;
  totalPrice: number;
  deposit: number;
  status: OrderStatus;
  damageStatus: DamageStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface DashboardLowStockPlant {
  _id: string;
  name: string;
  stock: number;
  category: string;
}

export interface DashboardTopPlant {
  plantId: string;
  name: string;
  category: string;
  totalOrdered: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalPlants: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: DashboardOrdersByStatus;
  recentOrders: DashboardRecentOrder[];
  lowStockPlants: DashboardLowStockPlant[];
  topPlants: DashboardTopPlant[];
}

export interface DashboardResponse {
  success: true;
  data: DashboardStats;
}

// ─── Admin Orders ─────────────────────────────────────────────────────────────

export interface AdminOrderUser {
  _id: string;
  name: string;
  email: string;
}

export interface AdminOrderPlant {
  _id: string;
  name: string;
  category: string;
}

export interface AdminOrderItem {
  plantId: AdminOrderPlant;
  quantity: number;
  _id: string;
}

export interface AdminOrder {
  _id: string;
  userId: AdminOrderUser;
  plants: AdminOrderItem[];
  rentalStartDate: string;
  rentalEndDate: string;
  totalPrice: number;
  deposit: number;
  deliveryAddress: string;
  status: OrderStatus;
  damageStatus: DamageStatus;
  depositRefunded: boolean;
  paymentStatus: PaymentStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrdersFilters {
  status?: OrderStatus;
  damageStatus?: DamageStatus;
  paymentStatus?: PaymentStatus;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AdminOrdersResponse {
  success: true;
  data: {
    orders: AdminOrder[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface UpdateOrderDamageRequest {
  damageStatus: DamageStatus;
}

export interface UpdateOrderDepositRequest {
  depositRefunded: boolean;
}

// ─── Admin Plants ─────────────────────────────────────────────────────────────

export interface AdminPlantsFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreatePlantRequest {
  name: string;
  category: string;
  description: string;
  pricePerDay: number;
  depositAmount: number;
  stock: number;
  careLevel: CareLevel;
  images: string[];
  isAvailable: boolean;
}

export type UpdatePlantRequest = Partial<CreatePlantRequest>;

export interface AdminPlantResponse {
  success: true;
  data: {
    _id: string;
    name: string;
    category: string;
    description: string;
    pricePerDay: number;
    depositAmount: number;
    stock: number;
    careLevel: CareLevel;
    images: string[];
    isAvailable: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// ─── Admin Users ──────────────────────────────────────────────────────────────

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isDeleted: boolean;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersFilters {
  role?: UserRole;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminUsersResponse {
  success: true;
  data: {
    users: AdminUser[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface AdminUserResponse {
  success: true;
  data: {
    user: AdminUser;
  };
}

export interface ToggleUserStatusRequest {
  isActive: boolean;
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  role: Exclude<UserRole, 'user'>;
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface AdminMessageResponse {
  success: true;
  message: string;
}
