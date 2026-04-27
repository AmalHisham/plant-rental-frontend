import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlant } from '../hooks/plantsQueries';
import CareLevelBadge from './CareLevelBadge';
import type { CareLevel } from '../types';
import { useWishlistIds, useAddToWishlist, useRemoveFromWishlist } from '../../wishlist/hooks/wishlistQueries';
import { useAddToCart } from '../../cart/hooks/cartQueries';
import { useAppSelector } from '../../../store';
import axios from 'axios';

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  visible: boolean;
}

function Toast({ message, visible }: ToastProps) {
  return (
    // aria-live="polite" announces the toast to screen readers without interrupting.
    // pointer-events-none when hidden prevents invisible element from blocking clicks.
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl transition-all duration-300 whitespace-nowrap ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
      }`}
    >
      {message}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

// Skeleton mirrors the two-column layout so there's no layout shift when
// the real content loads in.
function PlantDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-4 w-48 bg-gray-200 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-[4/3] bg-gray-200 rounded-xl" />
          <div className="space-y-4 pt-1">
            <div className="h-7 w-3/4 bg-gray-200 rounded" />
            <div className="flex gap-2">
              <div className="h-5 w-20 bg-gray-200 rounded-full" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
              <div className="h-5 w-20 bg-gray-200 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
              <div className="h-4 w-4/6 bg-gray-200 rounded" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-20 bg-gray-200 rounded-xl" />
              <div className="h-20 bg-gray-200 rounded-xl" />
              <div className="h-20 bg-gray-200 rounded-xl" />
            </div>
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-40 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

interface GalleryProps {
  images: string[];
  name: string;
}

function ImageGallery({ images, name }: GalleryProps) {
  const [active, setActive] = useState(0);
  // fading drives a CSS opacity transition: image fades to 0 → swap src → fade back to 1.
  // This avoids a jarring instant swap without a complex animation library.
  const [fading, setFading] = useState(false);

  // useCallback: switchTo is referenced in the keyboard effect's dep array.
  // Without memoization every render would re-register the keydown listener.
  const switchTo = useCallback(
    (idx: number) => {
      if (idx === active) return;
      setFading(true);
      // 150ms matches the CSS transition-duration so the new image appears at opacity-0
      // before fading back in, creating a smooth cross-dissolve effect.
      setTimeout(() => {
        setActive(idx);
        setFading(false);
      }, 150);
    },
    [active],
  );

  // Arrow key navigation — registered at window level so the user doesn't need
  // to focus the image element first. Effect re-runs when active or images.length
  // changes so switchTo always has the latest active index in scope.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') switchTo(Math.max(0, active - 1));
      if (e.key === 'ArrowRight') switchTo(Math.min(images.length - 1, active + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, images.length, switchTo]);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-xl bg-green-50 flex items-center justify-center text-7xl select-none">
        🪴
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
        <img
          src={images[active]}
          alt={name}
          className={`w-full h-full object-cover transition-opacity duration-150 ${
            fading ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Counter badge — only shown when there are multiple images. */}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full select-none">
            {active + 1} / {images.length}
          </span>
        )}

        {/* Prev arrow — only rendered when there's a previous image to go to. */}
        {active > 0 && (
          <button
            onClick={() => switchTo(active - 1)}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
          >
            <ChevronLeftIcon />
          </button>
        )}

        {/* Next arrow — only rendered when there's a next image. */}
        {active < images.length - 1 && (
          <button
            onClick={() => switchTo(active + 1)}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>

      {/* Thumbnails — active thumbnail gets a green border; others are dimmed. */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => switchTo(i)}
              aria-label={`View image ${i + 1}`}
              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-150 hover:scale-105 ${
                i === active
                  ? 'border-green-500 shadow-sm'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── At a Glance ─────────────────────────────────────────────────────────────

// Static lookup table keyed by CareLevel — avoids a switch/if-else chain.
// Values are approximate descriptions for the rental use case, not botanical facts.
const CARE_INFO: Record<CareLevel, { sunlight: string; water: string; location: string }> = {
  easy:   { sunlight: 'Low light',      water: 'Weekly',       location: 'Indoor'           },
  medium: { sunlight: 'Partial sun',    water: 'Every 3–4 d',  location: 'Indoor / Outdoor' },
  hard:   { sunlight: 'Bright direct',  water: 'Daily',        location: 'Outdoor'          },
};

function AtAGlance({ level }: { level: CareLevel }) {
  const info = CARE_INFO[level];
  const items = [
    { icon: '☀️', label: 'Sunlight',  value: info.sunlight  },
    { icon: '💧', label: 'Watering',  value: info.water     },
    { icon: '🏡', label: 'Location',  value: info.location  },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(({ icon, label, value }) => (
        <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-xl mb-1 select-none">{icon}</div>
          <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</div>
          <div className="text-xs text-gray-700 font-semibold mt-0.5 leading-snug">{value}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Care Tips Accordion ──────────────────────────────────────────────────────

// Collapsed by default — care tips are secondary info; hiding them reduces visual noise
// for users who just want to check price and availability.
const CARE_TIPS: Record<CareLevel, string[]> = {
  easy: [
    'Tolerates low light and irregular watering.',
    'Water only when the top inch of soil feels dry.',
    'Wipe leaves monthly to remove dust.',
  ],
  medium: [
    'Needs bright indirect light for best growth.',
    'Water every 3–4 days; let soil partially dry between waterings.',
    'Mist leaves in dry weather or place near a humidifier.',
  ],
  hard: [
    'Requires direct sunlight for several hours daily.',
    'Water daily in summer; reduce frequency in winter.',
    'Use well-draining soil and fertilize monthly during growing season.',
  ],
};

function CareTipsAccordion({ level }: { level: CareLevel }) {
  const [open, setOpen] = useState(false);
  const tips = CARE_TIPS[level];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>🌿 Care Tips</span>
        {/* CSS rotate-180 on the caret to show expand/collapse state without a second icon. */}
        <span
          className={`text-gray-400 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>
      {open && (
        <ul className="px-4 pb-4 pt-1 space-y-2 border-t border-gray-100">
          {tips.map((tip) => (
            <li key={tip} className="flex gap-2 text-sm text-gray-600">
              <span className="text-green-500 shrink-0 mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      )}
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
}

function Stepper({ value, onDecrement, onIncrement, min = 1, max }: StepperProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrement}
        disabled={value <= min}
        className="w-11 h-11 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100
          flex items-center justify-center text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        −
      </button>
      {/* tabular-nums prevents the number from shifting layout as it changes width. */}
      <span className="w-8 text-center font-semibold text-gray-800 text-base tabular-nums">
        {value}
      </span>
      <button
        onClick={onIncrement}
        // max is optional — for days stepper there's no upper bound, for quantity it's plant.stock.
        disabled={max !== undefined && value >= max}
        className="w-11 h-11 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100
          flex items-center justify-center text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
    </div>
  );
}

// ─── Preset Duration Pills ────────────────────────────────────────────────────

// Common rental windows surfaced as one-click shortcuts.
// "as const" makes the tuple readonly so TypeScript infers literal types (7, 14, 30).
const DURATION_PRESETS = [
  { label: '1W', days: 7  },
  { label: '2W', days: 14 },
  { label: '1M', days: 30 },
] as const;

// ─── PlantDetailsPage ─────────────────────────────────────────────────────────

export default function PlantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Read auth flag from Redux — avoids a redundant API call just to check login state.
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  // enabled: !!id guard (in plantsQueries) prevents the query from firing when id is undefined.
  const { data, isLoading, isError } = usePlant(id ?? '');

  const [quantity, setQuantity]             = useState(1);
  const [rentalDays, setRentalDays]         = useState(7);
  // activePreset tracks which pill is highlighted; null means the user typed a custom value.
  const [activePreset, setActivePreset]     = useState<number | null>(7);
  const [toast, setToast]                   = useState({ visible: false, message: '' });
  // notifyRequested is purely UI state — there's no backend endpoint for notifications yet.
  const [notifyRequested, setNotifyRequested] = useState(false);

  const wishlistIds                              = useWishlistIds();
  const { mutate: addToWishlist,    isPending: adding   } = useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: removing } = useRemoveFromWishlist();
  const { mutate: addToCart, isPending: cartAdding } = useAddToCart();

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    // Auto-hide after 2.5s — enough time to read, short enough not to be annoying.
    setTimeout(() => setToast({ visible: false, message: '' }), 2500);
  };

  const handlePreset = (days: number) => {
    setRentalDays(days);
    setActivePreset(days);
  };

  const handleCustomDays = (newDays: number) => {
    setRentalDays(newDays);
    // If the new value happens to match a preset, re-highlight that pill.
    const match = DURATION_PRESETS.find((p) => p.days === newDays);
    setActivePreset(match ? match.days : null);
  };

  if (isLoading) return <PlantDetailSkeleton />;

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 text-lg font-medium">Plant not found</p>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-green-600 hover:underline"
          >
            ← Back to all plants
          </button>
        </div>
      </div>
    );
  }

  const plant      = data.data;
  // lowStock threshold is 5 here (vs 3 on the card) — gives more urgency on the detail page.
  const outOfStock = !plant.isAvailable || plant.stock === 0;
  const lowStock   = !outOfStock && plant.stock <= 5;
  const isWishlisted    = wishlistIds.has(plant._id);
  // Disable the wishlist button during any pending mutation to prevent double-clicks.
  const wishlistPending = adding || removing;

  // Live price breakdown recomputed on every render — derived from state, not stored separately.
  const rentalTotal = plant.pricePerDay * rentalDays * quantity;
  const deposit     = plant.depositAmount * quantity;
  const totalPrice  = rentalTotal + deposit;

  // Start date is always tomorrow at midnight to give a full first day for logistics.
  // End date is start + rentalDays (not today + rentalDays) so the rental window is exact.
  const buildCartPayload = () => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + rentalDays);
    return {
      plantId: plant._id,
      quantity,
      rentalStartDate: start.toISOString(),
      rentalEndDate: end.toISOString(),
    };
  };

  // axios.isAxiosError narrows the unknown catch type — preferred over instanceof checks
  // because it works across different axios instances/versions.
  const getApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message ?? 'Something went wrong';
    }
    return 'Something went wrong';
  };

  const handleAddToCart = () => {
    // Redirect unauthenticated users to login — don't silently drop the action.
    if (!isAuthenticated) { navigate('/login'); return; }
    addToCart(buildCartPayload(), {
      onSuccess: () => showToast('✓ Added to cart'),
      onError: (err) => showToast(getApiError(err)),
    });
  };

  // "Rent Now" adds to cart then immediately navigates to checkout — no separate "go to cart" step.
  const handleRentNow = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    addToCart(buildCartPayload(), {
      onSuccess: () => navigate('/checkout'),
      onError: (err) => showToast(getApiError(err)),
    });
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (isWishlisted) removeFromWishlist(plant._id);
    else              addToWishlist(plant._id);
  };

  return (
    <>
      <Toast message={toast.message} visible={toast.visible} />

      {/* pb-28 on mobile creates clearance for the sticky bottom bar (approx. 80px + safe area).
          md:pb-8 removes the extra padding on desktop where the sticky bar is hidden. */}
      <div className="min-h-screen bg-gray-50 pb-28 md:pb-8">
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* ── Breadcrumb ── */}
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => navigate('/')}
              className="hover:text-green-600 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => navigate('/')}
              className="hover:text-green-600 transition-colors"
            >
              Plants
            </button>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate max-w-[200px]">{plant.name}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* ── Left: Image Gallery + supplementary info ── */}
            <div className="space-y-5">
              <ImageGallery images={plant.images} name={plant.name} />
              {/* AtAGlance and CareTips are derived from careLevel — no extra API data needed. */}
              <AtAGlance level={plant.careLevel} />
              <CareTipsAccordion level={plant.careLevel} />
            </div>

            {/* ── Right: Details ── */}
            <div className="space-y-5">

              {/* Header: name + wishlist + badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 leading-snug">{plant.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                      🌿 {plant.category}
                    </span>
                    <CareLevelBadge level={plant.careLevel} />
                    {outOfStock ? (
                      <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    ) : lowStock ? (
                      <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Only {plant.stock} left!
                      </span>
                    ) : (
                      <span className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
                        {plant.stock} in stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Dedicated wishlist heart beside the title for quick access. */}
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistPending}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className="shrink-0 w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
                >
                  <span className={`text-xl leading-none ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`}>
                    {isWishlisted ? '♥' : '♡'}
                  </span>
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">{plant.description}</p>

              {/* ── Booking card (available) ── */}
              {!outOfStock && (
                <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-4">

                  {/* Price header */}
                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{plant.pricePerDay}
                      <span className="text-sm font-normal text-gray-500">/day</span>
                    </p>
                    {/* Dotted underline + title tooltip explains the deposit without cluttering UI. */}
                    <p className="text-xs text-gray-400">
                      +{' '}
                      <span title="Fixed deposit per plant · fully refunded if returned undamaged" className="underline decoration-dotted cursor-help">
                        refundable deposit
                      </span>
                    </p>
                  </div>

                  {/* Preset duration pills */}
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-2">
                      Rental duration
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {DURATION_PRESETS.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => handlePreset(p.days)}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                            activePreset === p.days
                              ? 'bg-green-600 text-white border-green-600'
                              : 'border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-600'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                      {/* "Custom" clears the active preset so the user can use the days stepper freely. */}
                      <button
                        onClick={() => setActivePreset(null)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          activePreset === null
                            ? 'bg-green-600 text-white border-green-600'
                            : 'border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-600'
                        }`}
                      >
                        Custom
                      </button>
                    </div>
                  </div>

                  {/* Quantity + Days steppers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-2">
                        Quantity
                      </p>
                      {/* Max capped at plant.stock so the user can't order more than available. */}
                      <Stepper
                        value={quantity}
                        onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                        onIncrement={() => setQuantity((q) => Math.min(plant.stock, q + 1))}
                        min={1}
                        max={plant.stock}
                      />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-2">
                        Days
                      </p>
                      {/* No max for days — handleCustomDays keeps preset pills in sync. */}
                      <Stepper
                        value={rentalDays}
                        onDecrement={() => handleCustomDays(Math.max(1, rentalDays - 1))}
                        onIncrement={() => handleCustomDays(rentalDays + 1)}
                        min={1}
                      />
                    </div>
                  </div>

                  {/* Live price breakdown — recalculated from state on every render. */}
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>₹{plant.pricePerDay} × {rentalDays}d × {quantity}</span>
                      <span>₹{rentalTotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Refundable deposit (₹{plant.depositAmount}/plant)</span>
                      <span>₹{deposit}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
                      <span>Total</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-2.5">
                    <button
                      onClick={handleRentNow}
                      disabled={cartAdding}
                      className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {cartAdding ? 'Adding…' : 'Rent Now'}
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={cartAdding}
                      className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100 font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {cartAdding ? 'Adding…' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Out-of-stock card ── */}
              {outOfStock && (
                <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-3">
                  <p className="text-sm text-gray-500 text-center">
                    This plant is currently unavailable for rental.
                  </p>
                  {notifyRequested ? (
                    // Confirmation message replaces the button to prevent duplicate clicks.
                    <p className="text-center text-sm text-green-600 font-medium py-2">
                      ✓ We'll notify you when this plant is back in stock.
                    </p>
                  ) : (
                    // UI-only notification — no backend endpoint yet; state is local.
                    <button
                      onClick={() => setNotifyRequested(true)}
                      className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-colors text-sm"
                    >
                      🔔 Notify me when available
                    </button>
                  )}
                  <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistPending}
                    className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium py-3
                      rounded-xl transition-colors flex items-center justify-center gap-2
                      disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                  >
                    <span>{isWishlisted ? '♥' : '♡'}</span>
                    <span>{isWishlisted ? 'Wishlisted' : 'Save to Wishlist'}</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ──
          fixed + z-40 keeps it above content while scrolling.
          md:hidden hides it on desktop where the booking card is already visible in the viewport. */}
      {!outOfStock && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Total</p>
            <p className="font-bold text-gray-900 text-lg tabular-nums">₹{totalPrice}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={cartAdding}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shrink-0 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cartAdding ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>
      )}
    </>
  );
}
