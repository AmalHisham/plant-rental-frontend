import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 text-base text-gray-500 hover:text-green-600 transition-colors ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
        style={{ display: 'block' }}
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span className="leading-none">Back</span>
    </button>
  );
}
