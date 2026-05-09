import { useForm } from 'react-hook-form';
import axios from 'axios';
import PasswordInput from '../../../components/PasswordInput';
import { useChangePassword } from '../hooks/profileQueries';

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
};

export default function ChangePasswordSection() {
  const mutation = useChangePassword();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    mutation.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => reset(),
        onError: (err) => setError('root', { message: getApiError(err) }),
      }
    );
  };

  return (
    <section id="change-password" className="scroll-mt-20">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Change Password</h2>
      <p className="text-sm text-gray-500 mb-4">
        Leave unchanged if you signed in with Google.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="current-password" className="block text-xs font-medium text-gray-600 mb-1">
            Current Password
          </label>
          <PasswordInput
            id="current-password"
            placeholder="Enter current password"
            {...register('currentPassword', { required: 'Current password is required' })}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="new-password" className="block text-xs font-medium text-gray-600 mb-1">
            New Password
          </label>
          <PasswordInput
            id="new-password"
            placeholder="Minimum 8 characters"
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'New password must be at least 8 characters' },
            })}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-xs font-medium text-gray-600 mb-1">
            Confirm New Password
          </label>
          <PasswordInput
            id="confirm-password"
            placeholder="Re-enter new password"
            hasError={!!errors.confirmPassword}
            {...register('confirmPassword', {
              required: 'Please confirm your new password',
              validate: (val) => val === watch('newPassword') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {errors.root && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errors.root.message}
          </p>
        )}

        {isSubmitSuccessful && mutation.isSuccess && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            Password changed successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-60"
        >
          {mutation.isPending ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </section>
  );
}
