import axiosInstance from '../../../api/axiosInstance';
import type {
  CheckoutRequest,
  CheckoutResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from '../types';

// Turns the user's cart into a single order (clears the cart on success)
export const checkoutFromCart = (data: CheckoutRequest): Promise<CheckoutResponse> =>
  axiosInstance.post('/api/orders/checkout', data).then((r) => r.data);

// Creates a Razorpay order and returns the razorpayOrderId needed to open the payment widget
export const createPaymentOrder = (data: CreatePaymentRequest): Promise<CreatePaymentResponse> =>
  axiosInstance.post('/api/payment/create-order', data).then((r) => r.data);

// Checks the payment signature from Razorpay — marks the order as "paid" on success
export const verifyPayment = (data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> =>
  axiosInstance.post('/api/payment/verify', data).then((r) => r.data);
