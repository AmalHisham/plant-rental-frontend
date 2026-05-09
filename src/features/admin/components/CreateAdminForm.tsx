import { useForm } from 'react-hook-form';
import type { CreateAdminRequest } from '../types';
import type { UserRole } from '../../auth/types';

interface Props {
  onSubmit: (data: CreateAdminRequest) => void; // called with form data when user submits
  isLoading: boolean; // disables submit button while API call is in progress
}

type AdminRole = Exclude<UserRole, 'user'>;

interface FormValues {
  name: string;
  email: string;
  role: AdminRole;
}

// value → sent to backend, label → shown to user in dropdown
const ADMIN_ROLES: { value: AdminRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'product_admin', label: 'Product Admin' },
  { value: 'order_admin', label: 'Order Admin' },
  { value: 'delivery_admin', label: 'Delivery Admin' },
  { value: 'user_admin', label: 'User Admin' },
];

export default function CreateAdminForm({ onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { role: 'product_admin' } });

  const onFormSubmit = (data: FormValues) => {
    onSubmit({ name: data.name.trim(), email: data.email.trim().toLowerCase(), role: data.role });
  };

  // shared Tailwind classes to avoid repeating on every input/label
  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400';
  const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Name *</label>
        <input
          className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`}
          placeholder="John Doe"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Email *</label>
        <input
          type="email"
          className={`${inputClass} ${errors.email ? 'border-red-400' : ''}`}
          placeholder="admin@example.com"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
          })}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Role</label>
        <select className={inputClass} {...register('role')}>
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
