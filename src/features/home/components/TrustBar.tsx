// Static social-proof numbers — not fetched from the API.
const STATS = [
  { value: '500+', label: 'Plants Available' },
  { value: '2,000+', label: 'Happy Customers' },
  { value: '10+', label: 'Cities Served' },
  { value: '4.8★', label: 'Average Rating' },
];

export default function TrustBar() {
  return (
    <section className="border-y border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold text-green-700">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
