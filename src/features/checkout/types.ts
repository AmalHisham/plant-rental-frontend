// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus = 'booked' | 'delivered' | 'picked';
export type DamageStatus = 'none' | 'minor' | 'major';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderPlantItem {
  plantId: string;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  plants: OrderPlantItem[];
  rentalStartDate: string;
  rentalEndDate: string;
  totalPrice: number;
  deposit: number;
  deliveryAddress: string;
  status: OrderStatus;
  damageStatus: DamageStatus;
  depositRefunded: boolean;
  policyAccepted: true;
  paymentStatus: PaymentStatus;
  razorpayOrderId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export interface Payment {
  _id: string;
  orderId: string;
  userId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface CheckoutRequest {
  deliveryAddress: string;
  policyAccepted: true;
}

export interface CreatePaymentRequest {
  orderId: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
}

// ─── Response envelopes ───────────────────────────────────────────────────────

export interface CheckoutResponse {
  success: true;
  data: Order;   // backend: res.json({ success: true, data: order }) — order is directly in data
}

export interface CreatePaymentResponse {
  success: true;
  data: {
    razorpayOrderId: string;
    amount: number;      // INR (not paise) — multiply by 100 when passing to Razorpay widget
    currency: string;
    paymentId: string;
  };
}

export interface VerifyPaymentResponse {
  success: true;
  data: { payment: Payment };
}

// ─── Razorpay global type ─────────────────────────────────────────────────────

// Razorpay loads via a <script> tag; declare it on window so TypeScript accepts it.
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}
