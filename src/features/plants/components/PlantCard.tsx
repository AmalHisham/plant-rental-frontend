import { useNavigate } from 'react-router-dom';
import type { PlantCardData } from '../types';
import CareLevelBadge from './CareLevelBadge';
import WishlistButton from '../../wishlist/components/WishlistButton';

interface Props {
  plant: PlantCardData;
}

export default function PlantCard({ plant }: Props) {
  const navigate = useNavigate();

  // outOfStock: either the admin has toggled isAvailable off OR physical stock hit 0.
  // lowStock threshold is 3 — amber warning without blocking the user.
  const outOfStock = !plant.isAvailable || plant.stock === 0;
  const lowStock = !outOfStock && plant.stock <= 3;

  return (
    // Whole card is the click target so the hit area is large; useNavigate instead of <Link>
    // because we need the card to be a <div> (not nested anchors with WishlistButton inside).
    <div
      onClick={() => navigate(`/plants/${plant._id}`)}
      className="group block rounded-xl border border-gray-200 overflow-hidden bg-white
        hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {plant.images[0] ? (
          <img
            src={plant.images[0]}
            alt={plant.name}
            // scale-105 on hover is applied via parent's group class so the animation
            // runs independently of the card's own translate-y.
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          // Placeholder shown when the plant has no images uploaded yet.
          <div className="w-full h-full bg-green-50 flex items-center justify-center text-5xl select-none">
            🪴
          </div>
        )}

        {/* Semi-transparent overlay dims the image for out-of-stock plants
            without hiding it, communicating unavailability at a glance. */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40" />
        )}

        {/* Care level — top left */}
        <div className="absolute top-2 left-2">
          <CareLevelBadge level={plant.careLevel} />
        </div>

        {/* Wishlist heart — top right; stopPropagation on the button inside
            WishlistButton prevents the card's onClick from also firing. */}
        <div className="absolute top-1 right-1">
          <WishlistButton plantId={plant._id} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <h3 className="font-semibold text-gray-900 text-base truncate">{plant.name}</h3>
          {/* "Out of Stock" label duplicated in the content area so it's readable
              even if the image overlay is not clearly visible on small screens. */}
          {outOfStock && (
            <span className="shrink-0 text-xs font-medium text-red-500">Out of Stock</span>
          )}
        </div>

        <p className="text-xs text-gray-500 capitalize mb-3">{plant.category}</p>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-green-700 font-bold text-lg leading-tight">
              ₹{plant.pricePerDay}
              <span className="text-xs font-normal text-gray-400">/day</span>
            </p>
            {/* Deposit shown on the card so the user factors it into budget before clicking. */}
            <p className="text-xs text-gray-400 mt-0.5">Deposit ₹{plant.depositAmount}</p>
          </div>

          {/* Stock count hidden when out of stock (no useful info to show).
              Amber color for ≤3 nudges urgency without a hard block. */}
          {!outOfStock && (
            <span className={`text-xs font-medium ${lowStock ? 'text-amber-500' : 'text-gray-400'}`}>
              {lowStock ? `Only ${plant.stock} left` : `${plant.stock} available`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
