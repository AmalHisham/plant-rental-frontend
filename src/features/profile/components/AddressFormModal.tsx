import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAddAddress, useUpdateAddress } from '../hooks/profileQueries';
import type { Address } from '../types';
import { COUNTRY_CODE_IN } from '../../../config/constants';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Address;
}

interface FormValues {
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
};

const stripCountryCode = (phone: string) =>
  phone.startsWith(COUNTRY_CODE_IN) ? phone.slice(COUNTRY_CODE_IN.length) : phone;

export default function AddressFormModal({ isOpen, onClose, initialData }: AddressFormModalProps) {
  const addMutation = useAddAddress();
  const updateMutation = useUpdateAddress();

  const isEditing = !!initialData;
  const isPending = addMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      label: '',
      recipientName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    },
  });

  // Populate form when opening in edit mode, reset when opening in create mode.
  useEffect(() => {
    if (isOpen) {
      reset(
        initialData
          ? {
              label: initialData.label,
              recipientName: initialData.recipientName,
              phone: stripCountryCode(initialData.phone),
              addressLine1: initialData.addressLine1,
              addressLine2: initialData.addressLine2 ?? '',
              city: initialData.city,
              state: initialData.state,
              pincode: initialData.pincode,
              isDefault: initialData.isDefault,
            }
          : {
              label: '',
              recipientName: '',
              phone: '',
              addressLine1: '',
              addressLine2: '',
              city: '',
              state: '',
              pincode: '',
              isDefault: false,
            }
      );
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: FormValues) => {
    const payload = { ...data, phone: COUNTRY_CODE_IN + data.phone };
    if (isEditing) {
      const { isDefault: _ignored, ...updatePayload } = payload;
      updateMutation.mutate(
        { id: initialData!._id, data: updatePayload },
        {
          onSuccess: () => onClose(),
          onError: (err) => setError('root', { message: getApiError(err) }),
        }
      );
    } else {
      addMutation.mutate(payload, {
        onSuccess: () => onClose(),
        onError: (err) => setError('root', { message: getApiError(err) }),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Label */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Home, Office"
                {...register('label', { required: 'Label is required' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>}
            </div>

            {/* Recipient name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Recipient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Full name"
                {...register('recipientName', { required: 'Recipient name is required' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              {errors.recipientName && (
                <p className="text-red-500 text-xs mt-1">{errors.recipientName.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-sm text-gray-600 select-none">
                  {COUNTRY_CODE_IN}
                </span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  {...register('phone', {
                    required: 'Phone is required',
                    setValueAs: (v: string) => v.replace(/\D/g, '').slice(0, 10),
                  })}
                  className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Street address, building, flat no."
                {...register('addressLine1', { required: 'Address line 1 is required' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              {errors.addressLine1 && (
                <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>
              )}
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Address Line 2 <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="Landmark, area"
                {...register('addressLine2')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="City"
                  {...register('city', { required: 'City is required' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="State"
                  {...register('state', { required: 'State is required' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="6-digit pincode"
                maxLength={6}
                {...register('pincode', {
                  required: 'Pincode is required',
                  setValueAs: (v: string) => v.replace(/\D/g, '').slice(0, 6),
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>
              )}
            </div>

            {/* Default checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isDefault')}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Set as default address</span>
            </label>

            {/* API error */}
            {errors.root && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errors.root.message}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-green-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-green-700 transition disabled:opacity-60"
              >
                {isPending ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Address'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
