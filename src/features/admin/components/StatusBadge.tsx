import type { OrderStatus, DamageStatus, PaymentStatus } from '../../orders/types';

// accepts any of these three status types
type BadgeValue = OrderStatus | DamageStatus | PaymentStatus;

// maps each status value to a display label and background/text color
const BADGE_CONFIG: Record<string, { label: string; classes: string }> = {
  booked:    { label: 'Booked',     classes: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Delivered',  classes: 'bg-amber-100 text-amber-700' },
  picked:    { label: 'Returned',   classes: 'bg-green-100 text-green-700' },
  none:      { label: 'No Damage',  classes: 'bg-green-100 text-green-700' },
  minor:     { label: 'Minor',      classes: 'bg-amber-100 text-amber-700' },
  major:     { label: 'Major',      classes: 'bg-red-100 text-red-700' },
  pending:   { label: 'Pending',    classes: 'bg-yellow-100 text-yellow-700' },
  paid:      { label: 'Paid',       classes: 'bg-green-100 text-green-700' },
  failed:    { label: 'Failed',     classes: 'bg-red-100 text-red-700' },
};

interface Props {
  value: BadgeValue; // the status to display
}

export default function StatusBadge({ value }: Props) {
  const config = BADGE_CONFIG[value] ?? { label: value, classes: 'bg-gray-100 text-gray-600' }; // fall back to gray if status is unknown
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${config.classes}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" /> {/* small colored dot */}
      {config.label}
    </span>
  );
}
