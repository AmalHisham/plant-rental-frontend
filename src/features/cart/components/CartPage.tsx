import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from '../utils/cartQueries';
import type { CartItem } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

// en-IN locale formats dates like "24 Apr 2026" — readable without being verbose.
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// axios.isAxiosError narrows the unknown catch type reliably across axios versions.
const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
};

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  visible: boolean;
  type?: 'success' | 'error';
}

// Cart toast has an error variant (red bg) in addition to the default dark bg,
// because cart operations can fail for actionable reasons (e.g. stock ran out).
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

// ─── Stepper ──────────────────────────────────────────────────────────────────

interface StepperProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

function Stepper({ value, onDecrement, onIncrement, min = 1, max, disabled }: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrement}
        // disabled prop OR value at min — both cases prevent decrement.
        disabled={disabled || value <= min}
        className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100
          flex items-center justify-center text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        −
      </button>
      {/* tabular-nums keeps the number width stable so the layout doesn't shift between 1→2 digits. */}
      <span className="w-7 text-center font-semibold text-gray-800 text-sm tabular-nums">
        {value}
      </span>
      <button
        onClick={onIncrement}
        disabled={disabled || (max !== undefined && value >= max)}
        className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100
          flex items-center justify-center text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
    </div>
  );
}

// ─── CartItem Card ────────────────────────────────────────────────────────────

interface CartItemCardProps {
  item: CartItem;
  isProcessing: boolean;  // true while THIS specific item's mutation is in-flight
  onQuantityChange: (plantId: string, newQty: number) => void;
  onRentalDaysChange: (item: CartItem, newDays: number) => void;
  onRemove: (plantId: string) => void;
}

function CartItemCard({
  item,
  isProcessing,
  onQuantityChange,
  onRentalDaysChange,
  onRemove,
}: CartItemCardProps) {
  // item.plantId is the populated plant document, not a bare id string.
  const plant = item.plantId;
  const imageSrc = plant.images?.[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm">
      <div className="flex gap-4">
        {/* Image */}
        <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-green-50 flex items-center justify-center">
          {imageSrc ? (
            <img src={imageSrc} alt={plant.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl select-none">🪴</span>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-base leading-snug truncate">
                {plant.name}
              </h3>
              <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
                🌿 {plant.category}
              </span>
            </div>
            {/* Remove button — calls parent handler which owns the mutation and toast. */}
            <button
              onClick={() => onRemove(plant._id)}
              disabled={isProcessing}
              aria-label="Remove from cart"
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Rental period — formatted dates show the actual window rather than raw ISO strings. */}
          <p className="mt-2 text-xs text-gray-400">
            {formatDate(item.rentalStartDate)} → {formatDate(item.rentalEndDate)}
          </p>
        </div>
      </div>

      {/* Controls row */}
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div>
          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-2">
            Quantity
          </p>
          {/* max capped at plant.stock so the user can't order more than what's available. */}
          <Stepper
            value={item.quantity}
            min={1}
            max={plant.stock}
            disabled={isProcessing}
            onDecrement={() => onQuantityChange(plant._id, item.quantity - 1)}
            onIncrement={() => onQuantityChange(plant._id, item.quantity + 1)}
          />
        </div>
        <div>
          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-2">
            Rental days
          </p>
          {/* No max — user can extend the rental as long as they want. */}
          <Stepper
            value={item.rentalDays}
            min={1}
            disabled={isProcessing}
            onDecrement={() => onRentalDaysChange(item, item.rentalDays - 1)}
            onIncrement={() => onRentalDaysChange(item, item.rentalDays + 1)}
          />
        </div>
      </div>

      {/* Price breakdown — values come from the backend (rentalTotal, deposit, itemTotal)
          so the cart page never recomputes pricing client-side. */}
      <div className="mt-3 bg-gray-50 rounded-xl p-3 text-sm space-y-1">
        <div className="flex justify-between text-gray-500">
          <span>
            ₹{plant.pricePerDay}/day × {item.rentalDays}d × {item.quantity}
          </span>
          <span>₹{item.rentalTotal}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Deposit (refundable)</span>
          <span>₹{item.deposit}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1.5">
          <span>Item total</span>
          <span>₹{item.itemTotal}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

// Two placeholder cards match the typical initial cart size and prevent layout shift.
function CartSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 h-48" />
      ))}
    </div>
  );
}

// ─── CartPage ─────────────────────────────────────────────────────────────────

export default function CartPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCart();
  const { mutate: updateItem, isPending: updating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: removing } = useRemoveFromCart();
  const { mutate: clearAll, isPending: clearing } = useClearCart();

  // processingPlantId tracks which specific item is mid-mutation so only that
  // card's steppers are disabled, not the entire page.
  const [processingPlantId, setProcessingPlantId] = useState<string | null>(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  // anyPending: used to disable the checkout button and the "Clear all" action
  // while any mutation is in-flight (prevents concurrent conflicting updates).
  const anyPending = updating || removing || clearing;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
    // Spread current state to preserve the type field when hiding.
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  const handleQuantityChange = (plantId: string, newQty: number) => {
    setProcessingPlantId(plantId);
    updateItem(
      { plantId, data: { quantity: newQty } },
      {
        onSuccess: () => showToast('Quantity updated'),
        onError: (err) => showToast(getApiError(err), 'error'),
        onSettled: () => setProcessingPlantId(null),
      }
    );
  };

  const handleRentalDaysChange = (item: CartItem, newDays: number) => {
    if (newDays < 1) return;
    // Compute new end date by adding days to the existing start date — this preserves
    // the original start date the user chose in the detail page.
    const startDate = new Date(item.rentalStartDate);
    const newEndDate = new Date(startDate);
    newEndDate.setDate(newEndDate.getDate() + newDays);

    // Guard: if the existing start date is already in the past (stale cart),
    // re-anchor the end date from today so the backend doesn't reject it.
    const now = new Date();
    if (newEndDate <= now) {
      const todayBase = new Date();
      todayBase.setHours(0, 0, 0, 0);
      todayBase.setDate(todayBase.getDate() + newDays);
      newEndDate.setTime(todayBase.getTime());
    }

    setProcessingPlantId(item.plantId._id);
    // Only rentalEndDate is sent — the backend derives rentalDays from the date range.
    updateItem(
      { plantId: item.plantId._id, data: { rentalEndDate: newEndDate.toISOString() } },
      {
        onSuccess: () => showToast('Rental days updated'),
        onError: (err) => showToast(getApiError(err), 'error'),
        onSettled: () => setProcessingPlantId(null),
      }
    );
  };

  const handleRemove = (plantId: string) => {
    setProcessingPlantId(plantId);
    removeItem(plantId, {
      onSuccess: () => showToast('Item removed from cart'),
      onError: (err) => showToast(getApiError(err), 'error'),
      onSettled: () => setProcessingPlantId(null),
    });
  };

  const handleClearCart = () => {
    // clearAll takes no arguments — undefined signals "no payload" to the mutation.
    clearAll(undefined, {
      onSuccess: () => showToast('Cart cleared'),
      onError: (err) => showToast(getApiError(err), 'error'),
    });
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            <CartSkeleton />
            <div className="bg-white rounded-2xl border border-gray-200 h-64 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">Failed to load cart. Please try again.</p>
          <Link to="/plants" className="text-sm text-green-600 hover:underline">
            ← Browse Plants
          </Link>
        </div>
      </div>
    );
  }

  const cart = data?.data.cart;
  const items = cart?.items ?? [];

  // Derived totals broken out so the order summary can show the rental/deposit split.
  // grandTotal mirrors cart.cartTotal from the backend — not recomputed client-side.
  const rentalSubtotal = items.reduce((sum, item) => sum + item.rentalTotal, 0);
  const totalDeposit = items.reduce((sum, item) => sum + item.deposit, 0);
  const grandTotal = cart?.cartTotal ?? 0;

  // ── Empty state ──
  if (items.length === 0) {
    return (
      <>
        <Toast message={toast.message} visible={toast.visible} type={toast.type} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center space-y-5 max-w-sm">
            <div className="text-6xl select-none">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="text-gray-500 text-sm">
              Add some plants to get started with your rental.
            </p>
            <Link
              to="/plants"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Browse Plants
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ── Main cart ──
  return (
    <>
      <Toast message={toast.message} visible={toast.visible} type={toast.type} />

      <div className="min-h-screen bg-gray-50 pb-10">
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={handleClearCart}
              disabled={anyPending}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear all
            </button>
          </div>

          {/* lg:grid-cols-[1fr_340px]: fixed-width sidebar keeps the order summary
              from shrinking on mid-width viewports. */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

            {/* ── Items ── */}
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard
                  key={item.plantId._id}
                  item={item}
                  // Only disable THIS card's controls when its mutation is pending.
                  isProcessing={anyPending && processingPlantId === item.plantId._id}
                  onQuantityChange={handleQuantityChange}
                  onRentalDaysChange={handleRentalDaysChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* ── Order Summary ──
                lg:sticky + top-24 keeps the summary visible while the user scrolls a long list. */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm lg:sticky lg:top-24 space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>

              <div className="space-y-2 text-sm">
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
                Deposit is fully refunded if plant is returned undamaged after pickup.
              </p>

              <button
                onClick={() => navigate('/checkout')}
                disabled={anyPending}
                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/plants"
                className="block text-center text-sm text-green-600 hover:text-green-700 font-medium"
              >
                ← Continue browsing
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
