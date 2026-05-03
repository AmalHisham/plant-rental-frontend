export interface StepperProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  /** 'md' (default) = w-11 h-11 for booking cards; 'sm' = w-8 h-8 for cart items */
  size?: 'sm' | 'md';
}

export default function Stepper({
  value,
  onDecrement,
  onIncrement,
  min = 1,
  max,
  disabled,
  size = 'md',
}: StepperProps) {
  const btnSize = size === 'sm' ? 'w-8 h-8 text-lg' : 'w-11 h-11 text-lg';

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrement}
        disabled={disabled || value <= min}
        className={`${btnSize} rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100
          flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
      >
        −
      </button>
      {/* tabular-nums keeps the number width stable so the layout doesn't shift between 1→2 digits. */}
      <span className={`${size === 'sm' ? 'w-7 text-sm' : 'w-8 text-base'} text-center font-semibold text-gray-800 tabular-nums`}>
        {value}
      </span>
      <button
        onClick={onIncrement}
        disabled={disabled || (max !== undefined && value >= max)}
        className={`${btnSize} rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100
          flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
      >
        +
      </button>
    </div>
  );
}
