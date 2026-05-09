import type { CareLevel } from '../plants/types';

// Full plant info returned by the wishlist API (backend populates this automatically)
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

// Each wishlist entry holds the full plant object (not just the ID)
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
