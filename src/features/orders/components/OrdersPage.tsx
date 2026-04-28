import { Link } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import { useMyOrders } from '../hooks/ordersQueries';
import type { Order, OrderStatus, PaymentStatus } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// ─── Status badges ────────────────────────────────────────────────────────────

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  booked: 'bg-blue-100 text-blue-700',
  delivered: 'bg-amber-100 text-amber-700',
  picked: 'bg-green-100 text-green-700',
};

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  booked: 'Booked',
  delivered: 'Delivered',
  picked: 'Returned',
};

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ORDER_STATUS_STYLES[status]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${PAYMENT_STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const plantNames = order.plants
    .map((p) => `${p.plantId.name} ×${p.quantity}`)
    .join(', ');

  // Show the first plant's image as the card thumbnail.
  const firstImage = order.plants[0]?.plantId.images?.[0];

  return (
    <Link
      to={`/orders/${order._id}`}
      className="block bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-green-200 transition-all"
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-green-50 flex items-center justify-center">
          {firstImage ? (
            <img src={firstImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl select-none">🪴</span>
          )}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900 truncate">{plantNames}</p>
            <div className="flex items-center gap-1.5 shrink-0">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            {formatDate(order.rentalStartDate)} → {formatDate(order.rentalEndDate)}
          </p>

          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {order.deliveryAddress}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div className="text-sm">
              <span className="text-gray-500">Total: </span>
              <span className="font-bold text-gray-900">₹{order.totalPrice}</span>
              <span className="text-gray-400 text-xs ml-1">(incl. ₹{order.deposit} deposit)</span>
            </div>
            <span className="text-xs text-gray-400">
              {formatDate(order.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function OrdersSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 h-28" />
      ))}
    </div>
  );
}

// ─── OrdersPage ───────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { data, isLoading, isError } = useMyOrders();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="h-8 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
          <OrdersSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">Failed to load orders. Please try again.</p>
          <Link to="/plants" className="text-sm text-green-600 hover:underline">
            ← Browse Plants
          </Link>
        </div>
      </div>
    );
  }

  const orders = data?.data ?? [];

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center space-y-5 max-w-sm">
          <div className="text-6xl select-none">📦</div>
          <h2 className="text-2xl font-bold text-gray-900">No orders yet</h2>
          <p className="text-gray-500 text-sm">
            Your rental orders will appear here once you place one.
          </p>
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

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <BackButton className="mb-4" />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}
