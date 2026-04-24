import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { usePlants } from '../../plants/utils/plantsQueries';
import PlantCard from '../../plants/components/PlantCard';
import LoadingSkeleton from '../../plants/components/LoadingSkeleton';

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
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

// ─── Trust bar ────────────────────────────────────────────────────────────────

// Static social-proof numbers — not fetched from the API.
const STATS = [
  { value: '500+', label: 'Plants Available' },
  { value: '2,000+', label: 'Happy Customers' },
  { value: '10+', label: 'Cities Served' },
  { value: '4.8★', label: 'Average Rating' },
];

function TrustBar() {
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

// ─── How It Works ─────────────────────────────────────────────────────────────

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
      'When your rental ends, we pick up the plant hassle-free. Or simply extend — it\'s one tap away.',
  },
];

function HowItWorks() {
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

// ─── Featured Plants ──────────────────────────────────────────────────────────

function FeaturedPlants() {
  // limit:8 fetches only the first page of 8 plants — no pagination on the landing page.
  // This reuses the same React Query cache key as HomePage when filters are empty.
  const { data, isLoading, isError } = usePlants({ limit: 8 });
  const plants = data?.data.plants ?? [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-2">Our Collection</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Popular picks</h2>
          </div>
          <Link
            to="/plants"
            className="text-sm font-semibold text-green-700 hover:text-green-800 flex items-center gap-1 transition-colors"
          >
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : isError ? (
          <p className="text-center text-gray-400 py-10">Could not load plants right now.</p>
        ) : plants.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No plants available yet.</p>
        ) : (
          // 4-column grid on large screens vs 2 on sm — denser than HomePage (3-col)
          // because the landing page is a showcase rather than a browse interface.
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plants.map((plant) => (
              <PlantCard key={plant._id} plant={plant} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Category Grid ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Indoor', emoji: '🪴', value: 'indoor' },
  { label: 'Outdoor', emoji: '🌳', value: 'outdoor' },
  { label: 'Office', emoji: '💼', value: 'office' },
  { label: 'Succulents', emoji: '🌵', value: 'succulent' },
  { label: 'Tropical', emoji: '🌴', value: 'tropical' },
  { label: 'Flowering', emoji: '🌸', value: 'flowering' },
];

function CategoryGrid() {
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

// ─── Why Rent From Us ─────────────────────────────────────────────────────────

// Inline SVG icons keep this section self-contained — no icon library dependency
// for four icons that won't change often.
const BENEFITS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
      </svg>
    ),
    title: 'Free Delivery',
    description: 'Free doorstep delivery on all orders above ₹500. We handle the heavy lifting.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Expert Care Guides',
    description: 'Every rental comes with personalised care instructions curated by our horticulturists.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Flexible Durations',
    description: 'Rent for as short as 7 days or as long as 6 months. Extend anytime, no penalties.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Hassle-Free Returns',
    description: 'When you\'re done, we pick up. No questions asked, full deposit refund within 3 days.',
  },
];

function WhyRentFromUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-2">Why Us</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Everything taken care of</h2>
          <p className="mt-3 text-gray-500">We handle the hard part so you can just enjoy the greenery</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map(({ icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-gray-200 bg-gray-50 p-7">
              {/* Icon container provides consistent sizing and the green tint background. */}
              <div className="w-11 h-11 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-5">
                {icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

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

function Testimonials() {
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

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner() {
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

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand — lg:col-span-2 gives it more width than the other two columns. */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <span className="text-2xl">🌿</span>
              <span>LeafRent</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Bringing nature indoors — one rental at a time. Premium plants,
              doorstep delivery, zero hassle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Quick Links</p>
            <ul className="space-y-3 text-sm">
              <li><Link to="/plants" className="hover:text-white transition-colors">Browse Plants</Link></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Contact</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <span>hello@leafrent.in</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>Mon–Sat, 9 am – 6 pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright — new Date().getFullYear() keeps the year current without manual updates. */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} LeafRent. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── LandingPage ──────────────────────────────────────────────────────────────

// Sections are kept as separate components rather than one large render function
// so each section can be read and reasoned about independently.
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustBar />
      <HowItWorks />
      <FeaturedPlants />
      <CategoryGrid />
      <WhyRentFromUs />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
}
