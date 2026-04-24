import { Link } from 'react-router-dom';

export default function Footer() {
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
