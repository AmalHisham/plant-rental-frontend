import axiosInstance from '../../../api/axiosInstance';
import type {
  ProfileResponse,
  AddressesResponse,
  AddressResponse,
  MessageResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  CreateAddressRequest,
  UpdateAddressRequest,
} from '../types';

export const getProfile = (): Promise<ProfileResponse> =>
  axiosInstance.get('/api/profile').then((r) => r.data);

export const updateProfile = (data: UpdateProfileRequest): Promise<ProfileResponse> =>
  axiosInstance.patch('/api/profile', data).then((r) => r.data);

export const changePassword = (data: ChangePasswordRequest): Promise<MessageResponse> =>
  axiosInstance.patch('/api/profile/change-password', data).then((r) => r.data);

export const acceptPolicy = (): Promise<MessageResponse> =>
  axiosInstance.patch('/api/profile/accept-policy').then((r) => r.data);

export const getAddresses = (): Promise<AddressesResponse> =>
  axiosInstance.get('/api/profile/addresses').then((r) => r.data);

export const addAddress = (data: CreateAddressRequest): Promise<AddressResponse> =>
  axiosInstance.post('/api/profile/addresses', data).then((r) => r.data);

export const updateAddress = (id: string, data: UpdateAddressRequest): Promise<AddressResponse> =>
  axiosInstance.patch(`/api/profile/addresses/${id}`, data).then((r) => r.data);

export const deleteAddress = (id: string): Promise<MessageResponse> =>
  axiosInstance.delete(`/api/profile/addresses/${id}`).then((r) => r.data);

export const setDefaultAddress = (id: string): Promise<AddressResponse> =>
  axiosInstance.patch(`/api/profile/addresses/${id}/default`).then((r) => r.data);
