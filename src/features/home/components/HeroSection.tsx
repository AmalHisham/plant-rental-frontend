import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 py-16 lg:py-24">
      {/* Decorative blobs — pointer-events-none prevents them from blocking clicks. */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-green-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div className="max-w-lg">
            <span className="inline-block mb-5 text-xs font-semibold uppercase tracking-widest text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
              Free delivery on your first order
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Rent beautiful plants{' '}
              <span className="text-green-600">for your space</span>
            </h1>

            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              Transform any room with lush greenery — no commitment, no watering
              guides required. We deliver, you enjoy.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/plants"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors shadow-sm shadow-green-200"
              >
                Browse Plants
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              {/* Anchor link scrolls to HowItWorks section — scroll-mt-16 on that section
                  compensates for the sticky navbar height. */}
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:border-green-500 hover:text-green-700 transition-colors bg-white"
              >
                How It Works
              </a>
            </div>

            <p className="mt-6 text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
              <span>✓ 500+ plants available</span>
              <span>✓ Doorstep delivery</span>
              <span>✓ 4.8★ rated</span>
            </p>
          </div>

          {/* Right — decorative visual (static, not real data) */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Circle backdrop behind the plant card */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full bg-green-100/70" />
            </div>

            {/* Main plant card — hardcoded sample to illustrate the product. */}
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-2 w-56">
              <span className="text-8xl select-none">🪴</span>
              <p className="font-semibold text-gray-800 text-sm mt-1">Monstera Deliciosa</p>
              <p className="text-green-700 font-bold">₹35<span className="text-gray-400 text-xs font-normal">/day</span></p>
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Easy care</span>
            </div>

            {/* Floating chip — customers */}
            <div className="absolute z-20 -left-4 top-1/4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-100">
              <div className="flex -space-x-2">
                {/* Avatar initials using -space-x-2 overlap to mimic a stacked avatar list. */}
                {['A', 'R', 'P'].map((l) => (
                  <div key={l} className="w-7 h-7 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">2,000+ customers</p>
                <div className="flex text-yellow-400 text-xs">{'★'.repeat(5)}</div>
              </div>
            </div>

            {/* Floating chip — cities */}
            <div className="absolute z-20 -right-2 bottom-6 bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100">
              <p className="text-xs font-semibold text-gray-800">🏙️ 10+ Cities</p>
              <p className="text-xs text-gray-400 mt-0.5">across India</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
