export type OrderStatus = 'booked' | 'delivered' | 'picked';
export type DamageStatus = 'none' | 'minor' | 'major';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

// Full plant info embedded in each order item (backend populates this automatically)
export interface OrderPlant {
  _id: string;
  name: string;
  category: string;
  images: string[];
  pricePerDay: number;
  depositAmount: number;
}

export interface OrderItem {
  plantId: OrderPlant;   // full plant object, not just an ID
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  plants: OrderItem[];
  rentalStartDate: string;
  rentalEndDate: string;
  totalPrice: number;
  deposit: number;
  deliveryAddress: string;
  status: OrderStatus;
  damageStatus: DamageStatus;
  depositRefunded: boolean;
  policyAccepted: boolean;
  paymentStatus: PaymentStatus;
  razorpayOrderId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
}

export interface OrdersResponse {
  success: true;
  data: Order[];
  pagination: PaginationInfo;
}

export interface OrderResponse {
  success: true;
  data: Order;
}
