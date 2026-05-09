import { useState, useEffect } from 'react';

// Returns a version of `value` that only updates after `delay` ms of inactivity.
// Useful for search inputs — avoids firing an API call on every keystroke.
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cancel if value changes before the timer fires
  }, [value, delay]);

  return debounced;
}
