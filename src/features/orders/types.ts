export type OrderStatus = 'booked' | 'delivered' | 'picked';
export type DamageStatus = 'none' | 'minor' | 'major';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

// Populated plant fields embedded inside an order item.
// The backend populates plants.plantId via .populate() so we get full plant info.
export interface OrderPlant {
  _id: string;
  name: string;
  category: string;
  images: string[];
  pricePerDay: number;
  depositAmount: number;
}

export interface OrderItem {
  plantId: OrderPlant;   // populated
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

// ─── API response envelopes ────────────────────────────────────────────────────

export interface OrdersResponse {
  success: true;
  data: Order[];   // GET /api/orders → { success: true, data: orders[] }
}

export interface OrderResponse {
  success: true;
  data: Order;
}
