export type CareLevel = 'easy' | 'medium' | 'hard';

// Minimal plant info used on cards (browse, wishlist, cart)
export interface PlantCardData {
  _id: string;
  name: string;
  category: string;
  pricePerDay: number;
  depositAmount: number;
  stock: number;
  careLevel: CareLevel;
  images: string[];
  isAvailable: boolean;
}

export interface Plant {
  _id: string;
  name: string;
  category: string;
  description: string;
  pricePerDay: number;
  depositAmount: number;
  stock: number;
  careLevel: CareLevel;
  images: string[];
  isAvailable: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PlantsResponse {
  success: true;
  data: {
    plants: Plant[];
    pagination: PaginationInfo;
  };
}

export interface PlantResponse {
  success: true;
  data: Plant;
}

export interface PlantFilters {
  category?: string;
  careLevel?: CareLevel;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}
