import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import BackButton from '../../../components/BackButton';
import { useCart, CART_QUERY_KEY } from '../../cart/hooks/cartQueries';
import { useAddresses, useProfile } from '../../profile/hooks/profileQueries';
import {
  useCheckoutFromCart,
  useCreatePaymentOrder,
  useVerifyPayment,
} from '../hooks/checkoutQueries';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string' && msg) return msg;
    // Network error or no response (backend down / CORS)
    if (!error.response) return `Network error: ${error.message}`;
    return `Error ${error.response.status}: ${error.response.statusText || 'Something went wrong'}`;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
};

// Dynamically injects the Razorpay checkout script on demand.
// Resolves true if the script loads successfully, false if it fails.
// Skips re-injection if the script is already present.
const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  visible: boolean;
  type?: 'success' | 'error';
}

function Toast({ message, visible, type = 'success' }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl transition-all duration-300 whitespace-nowrap ${
        type === 'error' ? 'bg-red-600' : 'bg-gray-900'
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'}`}
    >
      {message}
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function CheckoutSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 h-48" />
        <div className="bg-white rounded-2xl border border-gray-200 p-5 h-32" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 h-72" />
    </div>
  );
}

// ─── CheckoutPage ─────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Server data ──
  const { data: cartData, isLoading: cartLoading, isError: cartError } = useCart();
  const { data: addressesData, isLoading: addressesLoading } = useAddresses();
  const { data: profileData } = useProfile();

  // ── Mutations ──
  const { mutateAsync: checkoutFromCart } = useCheckoutFromCart();
  const { mutateAsync: createPaymentOrder } = useCreatePaymentOrder();
  const { mutateAsync: verifyPayment } = useVerifyPayment();

  // ── UI state ──
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useManualAddress, setUseManualAddress] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [policyChecked, setPolicyChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  const addresses = addressesData?.data.addresses.filter((a) => !a.isDeleted) ?? [];
  const policyAlreadyAccepted = profileData?.data.user.policyAccepted ?? false;

  // Auto-select the default address once addresses load.
  useEffect(() => {
    if (addresses.length === 0) {
      setUseManualAddress(true);
      return;
    }
    const defaultAddr = addresses.find((a) => a.isDefault);
    setSelectedAddressId(defaultAddr?._id ?? addresses[0]._id);
  }, [addressesData]); // eslint-disable-line react-hooks/exhaustive-deps

  // If policy is already accepted on the account, pre-tick the checkbox.
  useEffect(() => {
    if (policyAlreadyAccepted) setPolicyChecked(true);
  }, [policyAlreadyAccepted]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  // Resolve the delivery address string from either the selected saved address
  // or the manual text field.
  const resolveDeliveryAddress = (): string | null => {
    if (useManualAddress) {
      return manualAddress.trim().length >= 5 ? manualAddress.trim() : null;
    }
    if (!selectedAddressId) return null;
    const addr = addresses.find((a) => a._id === selectedAddressId);
    if (!addr) return null;
    const parts = [
      addr.recipientName,
      addr.phone,
      addr.addressLine1,
      addr.addressLine2,
      addr.city,
      addr.state,
      addr.pincode,
    ].filter(Boolean);
    return parts.join(', ');
  };

  const handlePlaceOrder = async () => {
    // ── Client-side validation ──
    const deliveryAddress = resolveDeliveryAddress();
    if (!deliveryAddress) {
      showToast('Please provide a delivery address (min 5 characters)', 'error');
      return;
    }
    if (!policyChecked) {
      showToast('Please accept the rental policy to continue', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Convert cart → order
      const orderRes = await checkoutFromCart({ deliveryAddress, policyAccepted: true });
      const orderId = orderRes.data._id;

      // Step 2: Create Razorpay order
      const paymentRes = await createPaymentOrder({ orderId });
      const { razorpayOrderId, amount } = paymentRes.data;

      // Step 3: Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        showToast('Failed to load payment gateway. Please try again.', 'error');
        setIsProcessing(false);
        return;
      }

      // Step 4: Open Razorpay checkout modal
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
        // Amount must be in paise; backend returns INR so multiply by 100.
        amount: Math.round(amount * 100),
        currency: 'INR',
        order_id: razorpayOrderId,
        name: 'Plant Rental',
        description: 'Plant rental payment',
        theme: { color: '#16a34a' },

        // Step 5: Verify signature after successful payment
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            // Payment verified — now safe to clear the cart cache.
            void queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] });
            // Navigate away — orders page will show the confirmed order.
            navigate('/orders');
          } catch (err) {
            showToast(getApiError(err), 'error');
            setIsProcessing(false);
          }
        },

        modal: {
          // User closed the modal without paying — stay on checkout page.
          ondismiss: () => {
            showToast('Payment cancelled. Your order is saved — you can retry payment.', 'error');
            setIsProcessing(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      showToast(getApiError(err), 'error');
      setIsProcessing(false);
    }
  };

  // ── Loading ──
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="h-8 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
          <CheckoutSkeleton />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (cartError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">Failed to load cart. Please try again.</p>
          <Link to="/cart" className="text-sm text-green-600 hover:underline">
            ← Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  const cart = cartData?.data.cart;
  const items = cart?.items ?? [];

  // ── Empty cart — redirect user back to cart ──
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center space-y-5 max-w-sm">
          <div className="text-6xl select-none">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-gray-500 text-sm">Add some plants before checking out.</p>
          <Link
            to="/plants"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Browse Plants
          </Link>
        </div>
      </div>
    );
  }

  const rentalSubtotal = items.reduce((sum, item) => sum + item.rentalTotal, 0);
  const totalDeposit = items.reduce((sum, item) => sum + item.deposit, 0);
  const grandTotal = cart?.cartTotal ?? 0;

  return (
    <>
      <Toast message={toast.message} visible={toast.visible} type={toast.type} />

      <div className="min-h-screen bg-gray-50 pb-10">
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* Header */}
          <BackButton className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

            {/* ── Left column: form ── */}
            <div className="space-y-5">

              {/* ── Delivery Address ── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 text-base mb-4">Delivery Address</h2>

                {addressesLoading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-16 bg-gray-100 rounded-xl" />
                    <div className="h-16 bg-gray-100 rounded-xl" />
                  </div>
                ) : (
                  <>
                    {/* Saved addresses */}
                    {addresses.length > 0 && !useManualAddress && (
                      <div className="space-y-3 mb-4">
                        {addresses.map((addr) => (
                          <label
                            key={addr._id}
                            className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                              selectedAddressId === addr._id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="address"
                              value={addr._id}
                              checked={selectedAddressId === addr._id}
                              onChange={() => setSelectedAddressId(addr._id)}
                              className="mt-1 accent-green-600"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gray-900 text-sm">
                                  {addr.label}
                                </span>
                                {addr.isDefault && (
                                  <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                {addr.recipientName} · {addr.phone}
                              </p>
                              <p className="text-xs text-gray-500 leading-relaxed">
                                {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode]
                                  .filter(Boolean)
                                  .join(', ')}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Toggle between saved and manual */}
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setUseManualAddress((v) => !v)}
                        className="text-sm text-green-600 hover:text-green-700 font-medium mb-3"
                      >
                        {useManualAddress ? '← Use a saved address' : '+ Enter address manually'}
                      </button>
                    )}

                    {/* Manual text entry */}
                    {useManualAddress && (
                      <textarea
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        placeholder="Enter your full delivery address (house no., street, city, state, pincode)"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      />
                    )}
                  </>
                )}
              </div>

              {/* ── Rental Policy ── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 text-base mb-3">Rental Policy</h2>

                {policyAlreadyAccepted ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-xl px-4 py-3 text-sm font-medium">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Rental policy already accepted on your account
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-gray-500 leading-relaxed space-y-1 mb-4 bg-gray-50 rounded-xl p-4">
                      <p>• Rental period starts and ends on the dates you selected.</p>
                      <p>• A refundable deposit is held and returned when plants are picked up undamaged.</p>
                      <p>• Minor or major damage may result in partial or full deposit forfeiture.</p>
                      <p>• Cancellations after order placement are subject to our cancellation policy.</p>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={policyChecked}
                        onChange={(e) => setPolicyChecked(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-green-600 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">
                        I have read and agree to the rental policy
                      </span>
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* ── Right column: order summary ── */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm lg:sticky lg:top-24 space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>

              {/* Item list */}
              <div className="space-y-3">
                {items.map((item) => {
                  const plant = item.plantId;
                  return (
                    <div key={plant._id} className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-green-50 flex items-center justify-center">
                        {plant.images?.[0] ? (
                          <img src={plant.images[0]} alt={plant.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl select-none">🪴</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{plant.name}</p>
                        <p className="text-[11px] text-gray-400">
                          Qty {item.quantity} · {formatDate(item.rentalStartDate)} → {formatDate(item.rentalEndDate)}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-700 shrink-0">₹{item.itemTotal}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Rental subtotal</span>
                  <span>₹{rentalSubtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total deposit (refundable)</span>
                  <span>₹{totalDeposit}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Grand total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                Deposit is fully refunded if plants are returned undamaged after pickup.
              </p>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  `Place Order & Pay ₹${grandTotal}`
                )}
              </button>

              <Link
                to="/cart"
                className="block text-center text-sm text-green-600 hover:text-green-700 font-medium"
              >
                ← Back to Cart
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
