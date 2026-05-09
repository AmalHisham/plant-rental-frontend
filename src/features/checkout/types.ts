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

// ─── Response types ───────────────────────────────────────────────────────────

export interface CheckoutResponse {
  success: true;
  data: Order;
}

export interface CreatePaymentResponse {
  success: true;
  data: {
    razorpayOrderId: string;
    amount: number;      // in INR — multiply by 100 before passing to the Razorpay widget
    currency: string;
    paymentId: string;
  };
}

export interface VerifyPaymentResponse {
  success: true;
  data: { payment: Payment };
}

// Razorpay is loaded via a <script> tag at runtime — this tells TypeScript it exists on window
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}
