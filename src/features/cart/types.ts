export type CareLevel = 'easy' | 'medium' | 'hard';

// Full plant info embedded in each cart item (the backend fills this in automatically)
export interface CartPlant {
  _id: string;
  name: string;
  category: string;
  pricePerDay: number;
  depositAmount: number;
  careLevel: CareLevel;
  images: string[];
  isAvailable: boolean;
  stock: number;  // used to cap the quantity stepper on the cart page
}

export interface CartItem {
  plantId: CartPlant;   // full plant object, not just an ID
  quantity: number;
  rentalStartDate: string;
  rentalEndDate: string;
  rentalDays: number;   // calculated by the backend from the date range
  rentalTotal: number;  // pricePerDay × rentalDays × quantity
  deposit: number;      // depositAmount × quantity (refunded when the plant is returned)
  itemTotal: number;    // rentalTotal + deposit
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  cartTotal: number;  // sum of all item totals
}

// Standard response envelope for all cart API calls
export interface CartResponse {
  success: true;
  data: { cart: Cart };
}

// What we send to the backend when adding a plant to the cart
export interface AddToCartRequest {
  plantId: string;
  quantity: number;
  rentalStartDate: string;
  rentalEndDate: string;
}

// All fields are optional — only send what changed
export interface UpdateCartItemRequest {
  quantity?: number;
  rentalStartDate?: string;
  rentalEndDate?: string;
}
