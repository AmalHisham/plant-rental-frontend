import { Link } from 'react-router-dom';

const CATEGORIES = [
  { label: 'Indoor', emoji: '🪴', value: 'indoor' },
  { label: 'Outdoor', emoji: '🌳', value: 'outdoor' },
  { label: 'Office', emoji: '💼', value: 'office' },
  { label: 'Succulents', emoji: '🌵', value: 'succulent' },
  { label: 'Tropical', emoji: '🌴', value: 'tropical' },
  { label: 'Flowering', emoji: '🌸', value: 'flowering' },
];

export default function CategoryGrid() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-2">Browse by Type</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Find your perfect plant</h2>
        </div>

        {/* Each card links to /plants?category=<value> — drops the user directly into
            a filtered view without them having to set the filter manually. */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(({ label, emoji, value }) => (
            <Link
              key={value}
              to={`/plants?category=${value}`}
              className="group flex flex-col items-center gap-3 bg-white rounded-2xl border border-gray-200 p-6
                hover:border-green-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* scale-110 on the emoji via group-hover gives a subtle "pop" effect. */}
              <span className="text-4xl select-none group-hover:scale-110 transition-transform duration-200">
                {emoji}
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
