import { useMutation } from '@tanstack/react-query';
import { checkoutFromCart, createPaymentOrder, verifyPayment } from '../utils/checkoutApi';

// Converts the user's cart into an order.
// Cart invalidation is intentionally NOT done here — it happens in CheckoutPage
// after payment is verified, so the cart items stay visible during the entire
// payment flow (create order → Razorpay modal → verify). Invalidating here would
// clear the cart before payment completes, causing the page to show "cart is empty".
export const useCheckoutFromCart = () =>
  useMutation({ mutationFn: checkoutFromCart });

// Creates a Razorpay order for the given platform order ID.
// No cache invalidation needed — this is a write-only side-effect.
export const useCreatePaymentOrder = () =>
  useMutation({ mutationFn: createPaymentOrder });

// Verifies the Razorpay signature after the user completes payment.
// No cache invalidation needed here — the caller navigates away on success.
export const useVerifyPayment = () =>
  useMutation({ mutationFn: verifyPayment });
