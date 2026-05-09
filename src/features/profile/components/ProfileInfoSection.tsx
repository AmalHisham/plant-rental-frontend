import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAppSelector } from '../../../store';
import { useProfile, useUpdateProfile } from '../hooks/profileQueries';
import { COUNTRY_CODE_IN } from '../../../config/constants';

interface FormValues {
  name: string;
  phone: string;
}

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

  // Strip country code to get local digits for the input field
  const stripCountryCode = (phone: string | undefined) =>
    phone?.startsWith(COUNTRY_CODE_IN) ? phone.slice(COUNTRY_CODE_IN.length) : (phone ?? '');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    // Seed form from Redux immediately (no loading flicker)
    defaultValues: { name: reduxUser?.name ?? '', phone: stripCountryCode(reduxUser?.phone) },
  });

  const profileUser = data?.data.user;
  const email = profileUser?.email ?? reduxUser?.email ?? '';
  const role = profileUser?.role ?? reduxUser?.role ?? 'user';

  // Update form values when query resolves with fresh server data
  useEffect(() => {
    if (profileUser) {
      reset({ name: profileUser.name, phone: stripCountryCode(profileUser.phone) });
    }
  }, [profileUser, reset]);

  const originalPhone = profileUser?.phone ?? reduxUser?.phone ?? '';
  const originalName = profileUser?.name ?? reduxUser?.name ?? '';
  const currentName = watch('name');
  const currentPhone = watch('phone');
  // Compare local digits against stripped original
  const hasChanges =
    currentName.trim() !== originalName ||
    (COUNTRY_CODE_IN + currentPhone.replace(/\D/g, '').slice(0, 10)) !== originalPhone;

  const onSubmit = (data: FormValues) => {
    clearErrors();
    const payload: { name?: string; phone?: string } = {};
    if (data.name.trim() !== originalName) payload.name = data.name.trim();
    const fullPhone = data.phone.trim() ? COUNTRY_CODE_IN + data.phone.replace(/\D/g, '').slice(0, 10) : undefined;
    if (fullPhone !== originalPhone) payload.phone = fullPhone;

    mutation.mutate(payload, {
      onError: (err) => setError('root', { message: getApiError(err) }),
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="profile-name" className="block text-xs font-medium text-gray-600 mb-1">
            Full Name
          </label>
          <input
            id="profile-name"
            type="text"
            placeholder="Your name"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
              maxLength: { value: 50, message: 'Name must be at most 50 characters' },
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="profile-phone" className="block text-xs font-medium text-gray-600 mb-1">
            Phone Number <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-sm text-gray-600 select-none">
              {COUNTRY_CODE_IN}
            </span>
            <input
              id="profile-phone"
              type="tel"
              placeholder="9876543210"
              {...register('phone', {
                setValueAs: (v: string) => v.replace(/\D/g, '').slice(0, 10),
              })}
              maxLength={10}
              className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
        </div>

        {errors.root && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errors.root.message}
          </p>
        )}

        {isSubmitSuccessful && !errors.root && mutation.isSuccess && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            Profile updated successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending || !hasChanges}
          className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-60"
        >
          {mutation.isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </section>
  );
}
