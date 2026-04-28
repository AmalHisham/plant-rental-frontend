import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector, useAppDispatch } from '../../../store';
import { updateUser } from '../../auth/authSlice';
import {
  getProfile,
  updateProfile,
  changePassword,
  acceptPolicy,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../utils/profileApi';
import type { UpdateAddressRequest } from '../types';

export const PROFILE_QUERY_KEY = 'profile';
export const ADDRESSES_QUERY_KEY = 'addresses';

// ─── Profile ──────────────────────────────────────────────────────────────────

export const useProfile = () => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: getProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      const { name, phone } = data.data.user;
      // Sync the Redux store (and localStorage) so the navbar reflects the new name/phone.
      dispatch(updateUser({ name, phone }));
      void queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
  });
};

export const useChangePassword = () =>
  useMutation({ mutationFn: changePassword });

export const useAcceptPolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptPolicy,
    onSettled: () => void queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] }),
  });
};

// ─── Addresses ────────────────────────────────────────────────────────────────

export const useAddresses = () => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: [ADDRESSES_QUERY_KEY],
    queryFn: getAddresses,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAddress,
    onSettled: () => void queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] }),
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAddressRequest }) =>
      updateAddress(id, data),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] }),
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAddress,
    onSettled: () => void queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] }),
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setDefaultAddress,
    onSettled: () => void queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] }),
  });
};
