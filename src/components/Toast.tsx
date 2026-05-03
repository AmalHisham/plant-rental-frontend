export interface ToastProps {
  message: string;
  visible: boolean;
  type?: 'success' | 'error';
}

export default function Toast({ message, visible, type = 'success' }: ToastProps) {
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
