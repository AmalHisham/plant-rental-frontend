export type CareLevel = 'easy' | 'medium' | 'hard';

// CartPlant is the populated plant document embedded inside each cart item.
// The backend populates plantId via Mongoose .populate() so the client gets the
// full plant fields instead of a bare ObjectId.
export interface CartPlant {
  _id: string;
  name: string;
  category: string;
  pricePerDay: number;
  depositAmount: number;
  careLevel: CareLevel;
  images: string[];
  isAvailable: boolean;
  stock: number;  // used on the cart page to cap the quantity stepper
}

export interface CartItem {
  plantId: CartPlant;   // populated — not a bare id string
  quantity: number;
  rentalStartDate: string;
  rentalEndDate: string;
  rentalDays: number;   // computed by the backend from the date range; used to drive the stepper
  rentalTotal: number;  // pricePerDay × rentalDays × quantity
  deposit: number;      // depositAmount × quantity (held separately, refunded on return)
  itemTotal: number;    // rentalTotal + deposit
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  cartTotal: number;  // sum of all itemTotals
}

// All cart API responses share this envelope shape.
export interface CartResponse {
  success: true;
  data: { cart: Cart };
}

// Request types document the exact JSON payloads sent to the backend.
export interface AddToCartRequest {
  plantId: string;
  quantity: number;
  rentalStartDate: string;  // ISO 8601 — backend validates and derives rentalDays
  rentalEndDate: string;
}

// All fields optional — caller sends only what changed (partial update).
export interface UpdateCartItemRequest {
  quantity?: number;
  rentalStartDate?: string;
  rentalEndDate?: string;
}
