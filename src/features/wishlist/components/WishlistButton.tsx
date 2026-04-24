import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store';
import {
  useWishlistIds,
  useAddToWishlist,
  useRemoveFromWishlist,
} from '../utils/wishlistQueries';

interface Props {
  plantId: string;
  className?: string;
}

export default function WishlistButton({ plantId, className = '' }: Props) {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  // useWishlistIds returns a Set — O(1) membership check keeps rendering fast
  // when many cards are on screen at once.
  const wishlistIds = useWishlistIds();
  const isWishlisted = wishlistIds.has(plantId);

  const { mutate: add, isPending: adding } = useAddToWishlist();
  const { mutate: remove, isPending: removing } = useRemoveFromWishlist();
  // Combined pending flag disables the button during either add or remove mutation.
  const isPending = adding || removing;

  const handleClick = (e: React.MouseEvent) => {
    // Stop the event from bubbling to the parent PlantCard div's onClick,
    // which would navigate to the detail page when the user just wants to toggle.
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Guard against rapid double-clicks while a mutation is in flight.
    if (isPending) return;

    if (isWishlisted) {
      remove(plantId);
    } else {
      add(plantId);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform
        hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isWishlisted ? (
        // Filled red heart — indicates the plant is already wishlisted.
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-red-500 stroke-red-500 stroke-[1.5]">
          <path d="M12 21.593c-.528-.387-11-7.27-11-13.593 0-3.866 3.134-7 7-7 1.874 0 3.574.752 4.808 1.972C13.959 1.563 15.624.8 17.5.8c3.866 0 7 3.134 7 7 0 6.323-10.472 13.206-11 13.593z" />
        </svg>
      ) : (
        // Outlined white heart with a drop-shadow so it's visible on both light
        // and dark plant images without needing a background circle.
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-none stroke-white stroke-[2]"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }}
        >
          <path d="M12 21.593c-.528-.387-11-7.27-11-13.593 0-3.866 3.134-7 7-7 1.874 0 3.574.752 4.808 1.972C13.959 1.563 15.624.8 17.5.8c3.866 0 7 3.134 7 7 0 6.323-10.472 13.206-11 13.593z" />
        </svg>
      )}
    </button>
  );
}
