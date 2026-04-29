import { useState } from 'react';
import type { CreateAdminRequest } from '../types';
import type { UserRole } from '../../auth/types';

interface Props {
  onSubmit: (data: CreateAdminRequest) => void;
  isLoading: boolean;
}

type AdminRole = Exclude<UserRole, 'user'>;

const ADMIN_ROLES: { value: AdminRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'product_admin', label: 'Product Admin' },
  { value: 'order_admin', label: 'Order Admin' },
  { value: 'delivery_admin', label: 'Delivery Admin' },
  { value: 'user_admin', label: 'User Admin' },
];

export default function CreateAdminForm({ onSubmit, isLoading }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('product_admin');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Name is required.');
    if (!email.trim() || !email.includes('@')) return setError('A valid email is required.');

    onSubmit({ name: name.trim(), email: email.trim().toLowerCase(), role });
  };

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400';
  const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div>
        <label className={labelClass}>Name *</label>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className={labelClass}>Email *</label>
        <input
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label className={labelClass}>Role</label>
        <select
          className={inputClass}
          value={role}
          onChange={(e) => setRole(e.target.value as AdminRole)}
        >
          {ADMIN_ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-400">
        A temporary password will be sent to the admin's email address.
      </p>

      <div className="pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          Create Admin
        </button>
      </div>
    </form>
  );
}
