// Static testimonials — not fetched from an API.
const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'UX Designer, Bangalore',
    initials: 'PS',
    quote:
      'The Monstera I rented completely transformed my home office. The delivery was smooth and the plant arrived in perfect condition. Will 100% rent again!',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    role: 'Event Coordinator, Mumbai',
    initials: 'RM',
    quote:
      'We rented 20 plants for our office launch event. LeafRent was on time, professional, and the plants looked stunning. Our guests kept asking where we got them.',
    rating: 5,
  },
  {
    name: 'Anjali Verma',
    role: 'Interior Decorator, Delhi',
    initials: 'AV',
    quote:
      'I love being able to refresh my plant collection every few months without the guilt of killing them. The care guides that come with each rental are genuinely helpful.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    // Dark green background creates strong contrast — white text and cards stand out.
    <section className="py-20 bg-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-300 mb-2">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Loved by plant lovers</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, initials, quote, rating }) => (
            // bg-white/10 + backdrop-blur: glassmorphism card effect on the green bg.
            <div key={name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 flex flex-col gap-5 border border-white/20">
              <div className="flex text-yellow-300 text-sm tracking-wide">
                {'★'.repeat(rating)}
              </div>
              <p className="text-white/90 text-sm leading-relaxed flex-1">"{quote}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/20">
                <div className="w-9 h-9 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-green-300 text-xs">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
