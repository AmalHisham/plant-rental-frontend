import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CareLevel } from '../types';

const CATEGORIES = ['Indoor', 'Outdoor', 'Tropical', 'Succulent', 'Flowering', 'Foliage'];
const CARE_LEVELS: CareLevel[] = ['easy', 'medium', 'hard'];

export default function PlantFilters() {
  // Filters live in URL search params so they survive page refresh and are shareable via link.
  // PlantFiltersBar writes params; HomePage reads the same params to build the API query.
  const [params, setParams] = useSearchParams();

  // Local state mirrors the URL so inputs are controlled without firing a query on every keystroke.
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [minPrice, setMinPrice] = useState(params.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') ?? '');

  const updateParam = (key: string, value: string) => {
    // Copy existing params so other active filters are preserved.
    const next = new URLSearchParams(params);
    if (value) {
      next.set(key, value);
    } else {
      // Delete instead of set('', '') so the URL stays clean (no dangling ?search=).
      next.delete(key);
    }
    // Any filter change resets to page 1 — the old page offset is invalid in a new result set.
    next.delete('page');
    setParams(next);
  };

  // isFirstRender ref skips the debounce effect on mount so the initial URL param
  // doesn't immediately overwrite itself with the empty local state.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // 400ms debounce — avoids an API call on every keystroke while still feeling responsive.
    const timer = setTimeout(() => {
      updateParam('search', search.trim());
    }, 400);
    return () => clearTimeout(timer);
  // updateParam is recreated each render (captures current params via closure) so it's
  // intentionally excluded from the dep array to avoid resetting the debounce timer mid-type.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Price inputs commit on blur or Enter — not on every keystroke — to avoid firing a query
  // mid-number (e.g., typing "100" would trigger queries for "1", "10", "100").
  const handleMinPriceCommit = () => updateParam('minPrice', minPrice);
  const handleMaxPriceCommit = () => updateParam('maxPrice', maxPrice);

  // Clear resets both local state and URL params atomically.
  const clear = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setParams({});
  };

  return (
    <aside className="w-full lg:w-60 shrink-0 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          Filters
        </h2>
        <button
          onClick={clear}
          className="text-xs text-green-600 hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Search
        </label>
        <input
          type="text"
          placeholder="Search plants..."
          value={search}
          // Only updates local state; the debounce effect above propagates to URL.
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Category
        </label>
        {/* Reads directly from params (not local state) so the select stays in sync
            when the user navigates back from a plant detail page. */}
        <select
          value={params.get('category') ?? ''}
          onChange={(e) => updateParam('category', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Care Level */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Care Level
        </label>
        <div className="flex flex-col gap-2">
          {/* "Any" radio clears the careLevel param entirely. */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="careLevel"
              value=""
              checked={!params.get('careLevel')}
              onChange={() => updateParam('careLevel', '')}
              className="accent-green-600"
            />
            <span className="text-sm text-gray-700">Any</span>
          </label>
          {CARE_LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="careLevel"
                value={level}
                checked={params.get('careLevel') === level}
                onChange={() => updateParam('careLevel', level)}
                className="accent-green-600"
              />
              <span className="text-sm capitalize text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Price per Day (₹)
        </label>
        <div className="flex gap-2 items-center">
          {/* onBlur + onKeyDown Enter: both commit so keyboard users don't have to click away. */}
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={handleMinPriceCommit}
            onKeyDown={(e) => e.key === 'Enter' && handleMinPriceCommit()}
            className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={handleMaxPriceCommit}
            onKeyDown={(e) => e.key === 'Enter' && handleMaxPriceCommit()}
            className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>
    </aside>
  );
}
