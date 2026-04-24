import type { CareLevel } from '../types';

const config: Record<CareLevel, { label: string; classes: string }> = {
  easy: { label: 'Easy', classes: 'bg-green-100 text-green-700' },
  medium: { label: 'Medium', classes: 'bg-yellow-100 text-yellow-700' },
  hard: { label: 'Hard', classes: 'bg-red-100 text-red-700' },
};

interface Props {
  level: CareLevel;
}

export default function CareLevelBadge({ level }: Props) {
  // The lookup table keeps label and color mapping in one place.
  const { label, classes } = config[level];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}
