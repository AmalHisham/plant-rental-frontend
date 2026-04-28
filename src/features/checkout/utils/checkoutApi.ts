import axiosInstance from '../../../api/axiosInstance';
import type {
  CheckoutRequest,
  CheckoutResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from '../types';

// All checkout/payment operations use the shared authenticated axios client so
// the request interceptor automatically injects the Authorization header.

// Converts the user's cart into a single order. Cart is cleared on success.
export const checkoutFromCart = (data: CheckoutRequest): Promise<CheckoutResponse> =>
  axiosInstance.post('/api/orders/checkout', data).then((r) => r.data);

// Creates a Razorpay order for an existing platform order. Returns the
// razorpayOrderId needed to initialise the Razorpay checkout widget.
export const createPaymentOrder = (data: CreatePaymentRequest): Promise<CreatePaymentResponse> =>
  axiosInstance.post('/api/payment/create-order', data).then((r) => r.data);

// Verifies the HMAC signature returned by the Razorpay widget after the user
// completes payment. On success the order's paymentStatus is set to "paid".
export const verifyPayment = (data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> =>
  axiosInstance.post('/api/payment/verify', data).then((r) => r.data);
