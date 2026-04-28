import { useState } from 'react';
import type { Address } from '../types';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isDeleting: boolean;
  isSettingDefault: boolean;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault,
}: AddressCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white flex flex-col gap-3">
      {/* Header row: label + default badge */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800 text-sm">{address.label}</span>
        {address.isDefault && (
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Default
          </span>
        )}
      </div>

      {/* Address details */}
      <div className="text-sm text-gray-600 space-y-0.5">
        <p className="font-medium text-gray-800">{address.recipientName}</p>
        <p>{address.phone}</p>
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.state} – {address.pincode}
        </p>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="text-xs font-medium text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
        >
          Edit
        </button>

        {!address.isDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address._id)}
            disabled={isSettingDefault}
            className="text-xs font-medium text-green-700 border border-green-300 rounded-lg px-3 py-1.5 hover:bg-green-50 transition disabled:opacity-50"
          >
            {isSettingDefault ? 'Updating…' : 'Set as Default'}
          </button>
        )}

        {/* Delete with inline confirmation */}
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Remove this address?</span>
            <button
              type="button"
              onClick={() => {
                setConfirmDelete(false);
                onDelete(address._id);
              }}
              disabled={isDeleting}
              className="text-xs font-medium text-white bg-red-500 rounded-lg px-3 py-1.5 hover:bg-red-600 transition disabled:opacity-50"
            >
              {isDeleting ? 'Removing…' : 'Yes, remove'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-xs font-medium text-gray-600 hover:text-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-xs font-medium text-red-500 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
