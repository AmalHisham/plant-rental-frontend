import type { AuthUser } from '../auth/types';

// Full user profile from the server — adds extra fields not in the login response
export interface ProfileUser extends AuthUser {
  policyAccepted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Response types ───────────────────────────────────────────────────────────

export interface ProfileResponse {
  success: true;
  data: { user: ProfileUser };
}

export interface AddressesResponse {
  success: true;
  data: { addresses: Address[] };
}

export interface AddressResponse {
  success: true;
  data: { address: Address };
}

export interface MessageResponse {
  success: true;
  message: string;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateAddressRequest {
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export type UpdateAddressRequest = Partial<
  Omit<CreateAddressRequest, 'isDefault'>
>;
