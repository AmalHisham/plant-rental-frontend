import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-5xl select-none">🌱</span>
        <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-gray-900">
          Ready to green your space?
        </h2>
        <p className="mt-3 text-lg text-gray-600">
          Join thousands of happy customers who rent plants and never look back.
        </p>
        <Link
          to="/plants"
          className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-md shadow-green-200 text-sm"
        >
          Start Renting
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        <p className="mt-4 text-xs text-gray-400">No commitment. Cancel anytime.</p>
      </div>
    </section>
  );
}
