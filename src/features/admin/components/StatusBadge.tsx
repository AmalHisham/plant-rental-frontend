import type { OrderStatus, DamageStatus, PaymentStatus } from '../../orders/types';

type BadgeValue = OrderStatus | DamageStatus | PaymentStatus;

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
  value: BadgeValue;
}

export default function StatusBadge({ value }: Props) {
  const config = BADGE_CONFIG[value] ?? { label: value, classes: 'bg-gray-100 text-gray-600' };
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
