import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAddAddress, useUpdateAddress } from '../hooks/profileQueries';
import type { Address, CreateAddressRequest } from '../types';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Address;
}

const EMPTY_FORM: CreateAddressRequest = {
  label: '',
  recipientName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
};

const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
};

export default function AddressFormModal({ isOpen, onClose, initialData }: AddressFormModalProps) {
  const [form, setForm] = useState<CreateAddressRequest>(EMPTY_FORM);
  const [apiError, setApiError] = useState('');

  const addMutation = useAddAddress();
  const updateMutation = useUpdateAddress();

  const isEditing = !!initialData;
  const isPending = addMutation.isPending || updateMutation.isPending;

  // Populate form when opening in edit mode, reset when opening in create mode.
  useEffect(() => {
    if (isOpen) {
      setApiError('');
      setForm(
        initialData
          ? {
              label: initialData.label,
              recipientName: initialData.recipientName,
              phone: initialData.phone,
              addressLine1: initialData.addressLine1,
              addressLine2: initialData.addressLine2 ?? '',
              city: initialData.city,
              state: initialData.state,
              pincode: initialData.pincode,
              isDefault: initialData.isDefault,
            }
          : EMPTY_FORM
      );
    }
  }, [isOpen, initialData]);

  const set = (field: keyof CreateAddressRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setApiError('');

    if (isEditing) {
      const { isDefault: _ignored, ...updatePayload } = form;
      updateMutation.mutate(
        { id: initialData!._id, data: updatePayload },
        {
          onSuccess: () => onClose(),
          onError: (err) => setApiError(getApiError(err)),
        }
      );
    } else {
      addMutation.mutate(form, {
        onSuccess: () => onClose(),
        onError: (err) => setApiError(getApiError(err)),
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Label */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.label}
                onChange={set('label')}
                placeholder="e.g. Home, Office"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            {/* Recipient name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Recipient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.recipientName}
                onChange={set('recipientName')}
                placeholder="Full name"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setForm((prev) => ({ ...prev, phone: digits }));
                }}
                placeholder="10-digit number"
                required
                maxLength={10}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.addressLine1}
                onChange={set('addressLine1')}
                placeholder="Street address, building, flat no."
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Address Line 2 <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.addressLine2}
                onChange={set('addressLine2')}
                placeholder="Landmark, area"
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
                  value={form.city}
                  onChange={set('city')}
                  placeholder="City"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.state}
                  onChange={set('state')}
                  placeholder="State"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setForm((prev) => ({ ...prev, pincode: digits }));
                }}
                placeholder="6-digit pincode"
                required
                maxLength={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            {/* Default checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.isDefault}
                onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Set as default address</span>
            </label>

            {/* API error */}
            {apiError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {apiError}
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
