import { useParams, Link } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import { useMyOrderById } from '../hooks/ordersQueries';
import type { OrderStatus, PaymentStatus, DamageStatus } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

// ─── Badge helpers ────────────────────────────────────────────────────────────

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

const DAMAGE_STATUS_STYLES: Record<DamageStatus, string> = {
  none: 'bg-green-100 text-green-700',
  minor: 'bg-amber-100 text-amber-700',
  major: 'bg-red-100 text-red-700',
};
const DAMAGE_STATUS_LABELS: Record<DamageStatus, string> = {
  none: 'No damage',
  minor: 'Minor damage',
  major: 'Major damage',
};

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>
      {label}
    </span>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
      <h2 className="font-semibold text-gray-900 text-base">{title}</h2>
      {children}
    </div>
  );
}

// ─── Detail row ───────────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center text-sm gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
}

// ─── OrderDetailsPage ─────────────────────────────────────────────────────────

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useMyOrderById(id ?? '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-4 animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="bg-white rounded-2xl border border-gray-200 h-40" />
          <div className="bg-white rounded-2xl border border-gray-200 h-32" />
          <div className="bg-white rounded-2xl border border-gray-200 h-48" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">Order not found.</p>
          <Link to="/orders" className="text-sm text-green-600 hover:underline">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

        <BackButton className="mb-2" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">#{order._id}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge label={ORDER_STATUS_LABELS[order.status]} className={ORDER_STATUS_STYLES[order.status]} />
            <Badge label={order.paymentStatus} className={PAYMENT_STATUS_STYLES[order.paymentStatus]} />
          </div>
        </div>

        {/* Plants */}
        <Section title="Plants Rented">
          <div className="space-y-3">
            {order.plants.map((item) => {
              const plant = item.plantId;
              const img = plant.images?.[0];
              return (
                <div key={plant._id} className="flex items-center gap-3">
                  <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-green-50 flex items-center justify-center">
                    {img ? (
                      <img src={img} alt={plant.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl select-none">🪴</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{plant.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{plant.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900">×{item.quantity}</p>
                    <p className="text-xs text-gray-400">₹{plant.pricePerDay}/day</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Rental period */}
        <Section title="Rental Period">
          <Row label="Start date" value={formatDate(order.rentalStartDate)} />
          <Row label="End date" value={formatDate(order.rentalEndDate)} />
        </Section>

        {/* Payment breakdown */}
        <Section title="Payment Summary">
          <Row
            label="Rental total"
            value={`₹${order.totalPrice - order.deposit}`}
          />
          <Row
            label="Deposit (refundable)"
            value={`₹${order.deposit}`}
          />
          <div className="border-t border-gray-100 pt-2">
            <Row
              label="Grand total"
              value={<span className="text-base font-bold">₹{order.totalPrice}</span>}
            />
          </div>
          {order.depositRefunded && (
            <p className="text-xs text-green-600 font-medium">Deposit has been refunded.</p>
          )}
        </Section>

        {/* Delivery */}
        <Section title="Delivery Address">
          <p className="text-sm text-gray-700 leading-relaxed">{order.deliveryAddress}</p>
        </Section>

        {/* Damage & deposit status — only relevant after return */}
        {order.status === 'picked' && (
          <Section title="Return Assessment">
            <Row
              label="Damage status"
              value={
                <Badge
                  label={DAMAGE_STATUS_LABELS[order.damageStatus]}
                  className={DAMAGE_STATUS_STYLES[order.damageStatus]}
                />
              }
            />
            <Row
              label="Deposit refunded"
              value={order.depositRefunded ? 'Yes' : 'Not yet'}
            />
          </Section>
        )}

        {/* Timestamps */}
        <Section title="Order Info">
          <Row label="Placed on" value={formatDateTime(order.createdAt)} />
          <Row label="Last updated" value={formatDateTime(order.updatedAt)} />
          {order.razorpayOrderId && (
            <Row label="Razorpay order" value={<span className="font-mono text-xs">{order.razorpayOrderId}</span>} />
          )}
        </Section>

      </div>
    </div>
  );
}
