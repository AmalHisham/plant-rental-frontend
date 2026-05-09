import { useState, useEffect } from 'react';

// Shows a button in the bottom-right corner after scrolling past 400px.
// Clicking smoothly scrolls back to the top.
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-green-600 hover:bg-green-700
        text-white shadow-lg flex items-center justify-center transition-all duration-200
        ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
