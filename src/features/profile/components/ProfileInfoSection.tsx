import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppSelector } from '../../../store';
import { useProfile, useUpdateProfile } from '../hooks/profileQueries';

const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
};

export default function ProfileInfoSection() {
  const reduxUser = useAppSelector((s) => s.auth.user);
  const { data } = useProfile();
  const mutation = useUpdateProfile();

  // Seed form from Redux immediately (no loading flicker), then update when query resolves.
  const [name, setName] = useState(reduxUser?.name ?? '');
  const [phone, setPhone] = useState(reduxUser?.phone ?? '');
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (data) {
      setName(data.data.user.name);
      setPhone(data.data.user.phone ?? '');
    }
  }, [data]);

  const profileUser = data?.data.user;
  const email = profileUser?.email ?? reduxUser?.email ?? '';
  const role = profileUser?.role ?? reduxUser?.role ?? 'user';

  const originalName = profileUser?.name ?? reduxUser?.name ?? '';
  const originalPhone = profileUser?.phone ?? reduxUser?.phone ?? '';
  const hasChanges = name.trim() !== originalName || phone.trim() !== originalPhone;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccess(false);

    const payload: { name?: string; phone?: string } = {};
    if (name.trim() !== originalName) payload.name = name.trim();
    if (phone.trim() !== originalPhone) payload.phone = phone.trim() || undefined;

    mutation.mutate(payload, {
      onSuccess: () => setSuccess(true),
      onError: (err) => setApiError(getApiError(err)),
    });
  };

  const roleLabel: Record<string, string> = {
    user: 'Member',
    super_admin: 'Super Admin',
    product_admin: 'Product Admin',
    order_admin: 'Order Admin',
    delivery_admin: 'Delivery Admin',
    user_admin: 'User Admin',
  };

  return (
    <section id="profile-info" className="scroll-mt-20">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Profile Info</h2>
      <p className="text-sm text-gray-500 mb-4">Update your name and phone number</p>

      {/* Email + role read-only display */}
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="flex-1 min-w-48">
          <span className="text-xs font-medium text-gray-500 block mb-1">Email</span>
          <span className="text-sm text-gray-800">{email}</span>
        </div>
        <div>
          <span className="text-xs font-medium text-gray-500 block mb-1">Role</span>
          <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {roleLabel[role] ?? role}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="profile-name" className="block text-xs font-medium text-gray-600 mb-1">
            Full Name
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setSuccess(false); }}
            placeholder="Your name"
            required
            minLength={2}
            maxLength={50}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>

        <div>
          <label htmlFor="profile-phone" className="block text-xs font-medium text-gray-600 mb-1">
            Phone Number <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
              setPhone(digits);
              setSuccess(false);
            }}
            placeholder="e.g. 9876543210"
            maxLength={10}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>

        {apiError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {apiError}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            Profile updated successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending || !hasChanges}
          className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-60"
        >
          {mutation.isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </section>
  );
}
