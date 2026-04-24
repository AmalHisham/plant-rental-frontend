import type { CareLevel } from '../plants/types';

// WishlistPlant is the populated plant shape returned by GET /api/wishlist.
// The backend populates plants[].plantId via Mongoose .populate() so the client
// receives full plant data without a second fetch.
export interface WishlistPlant {
  _id: string;
  name: string;
  category: string;
  pricePerDay: number;
  depositAmount: number;
  careLevel: CareLevel;
  images: string[];
  isAvailable: boolean;
  stock: number;
}

// WishlistItem wraps the populated plant — the DB stores only the ObjectId
// reference but the API always returns the populated version.
export interface WishlistItem {
  plantId: WishlistPlant;
}

export interface Wishlist {
  userId: string;
  plants: WishlistItem[];
}

export interface WishlistResponse {
  success: true;
  data: {
    wishlist: Wishlist;
  };
}
