const STEPS = [
  {
    number: '01',
    emoji: '🔍',
    title: 'Browse & Choose',
    description:
      'Explore our curated collection of indoor, outdoor, and rare plants. Filter by category, care level, and budget.',
  },
  {
    number: '02',
    emoji: '🚚',
    title: 'We Deliver',
    description:
      'Select your rental duration — from 7 days to 6 months. We do white-glove delivery right to your door.',
  },
  {
    number: '03',
    emoji: '🔄',
    title: 'Return or Extend',
    description:
      "When your rental ends, we pick up the plant hassle-free. Or simply extend — it's one tap away.",
  },
];

export default function HowItWorks() {
  return (
    // id="how-it-works" is the anchor target for the "How It Works" button in HeroSection.
    // scroll-mt-16 offsets the scroll position by the navbar height so the section title
    // doesn't hide behind the sticky nav when scrolled to via the anchor link.
    <section id="how-it-works" className="py-20 scroll-mt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-3">Simple Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How LeafRent works</h2>
          <p className="mt-3 text-gray-500">From browse to doorstep in three easy steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Decorative connector lines between step cards (desktop only, -z-0 so cards sit above). */}
          <div className="hidden md:block absolute top-14 left-1/4 right-1/4 h-px bg-green-200 -z-0" />
          <div className="hidden md:block absolute top-14 left-1/2 right-1/4 h-px bg-green-200 -z-0" />

          {STEPS.map((step) => (
            <div key={step.number} className="relative bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-5">
                {step.number}
              </div>
              <div className="text-4xl mb-4 select-none">{step.emoji}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
