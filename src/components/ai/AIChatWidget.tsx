import { useState } from 'react';
import AIChatModal from './AIChatModal';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AIChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Pulse ring — only visible when closed, draws attention */}
      {!isOpen && (
        <span
          className="fixed bottom-5 right-4 z-40 h-14 w-14 rounded-full bg-green-500/40 sm:right-6
                     animate-ping pointer-events-none"
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          fixed bottom-5 right-4 z-50
          flex h-14 w-14 items-center justify-center
          rounded-full bg-green-600 text-white shadow-xl
          transition-all duration-300
          hover:scale-110 hover:bg-green-700
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2
          sm:right-6
        "
        aria-label={isOpen ? 'Close AI chat' : 'Open LeafRent AI chatbot'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {/* Animated icon swap */}
        <span
          className={`absolute transition-all duration-300 ${
            isOpen ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-50'
          }`}
          aria-hidden="true"
        >
          {/* Close × */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>

        <span
          className={`absolute transition-all duration-300 ${
            isOpen ? '-rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
          }`}
          aria-hidden="true"
        >
          {/* Chat bubble icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h8M8 14h5" strokeWidth="1.5" />
          </svg>
        </span>
      </button>
    </>
  );
};

export default AIChatWidget;
