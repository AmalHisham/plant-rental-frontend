import { useMutation } from '@tanstack/react-query';
import { checkoutFromCart, createPaymentOrder, verifyPayment } from '../utils/checkoutApi';

// Cart is NOT invalidated here — CheckoutPage does it after payment is confirmed,
// so the cart stays visible throughout the whole payment flow.
export const useCheckoutFromCart = () =>
  useMutation({ mutationFn: checkoutFromCart });

export const useCreatePaymentOrder = () =>
  useMutation({ mutationFn: createPaymentOrder });

// Page navigates away on success, so no cache invalidation needed
export const useVerifyPayment = () =>
  useMutation({ mutationFn: verifyPayment });
