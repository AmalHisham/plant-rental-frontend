import { useState } from 'react';
import axios from 'axios';
import PasswordInput from '../../../components/PasswordInput';
import { useChangePassword } from '../hooks/profileQueries';

const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
};

export default function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clientError, setClientError] = useState('');
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const mutation = useChangePassword();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setClientError('');
    setApiError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setClientError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setClientError('New password must be at least 8 characters');
      return;
    }

    mutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setSuccess(true);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
        onError: (err) => setApiError(getApiError(err)),
      }
    );
  };

  const error = clientError || apiError;

  return (
    <section id="change-password" className="scroll-mt-20">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Change Password</h2>
      <p className="text-sm text-gray-500 mb-4">
        Leave unchanged if you signed in with Google.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="current-password" className="block text-xs font-medium text-gray-600 mb-1">
            Current Password
          </label>
          <PasswordInput
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label htmlFor="new-password" className="block text-xs font-medium text-gray-600 mb-1">
            New Password
          </label>
          <PasswordInput
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-xs font-medium text-gray-600 mb-1">
            Confirm New Password
          </label>
          <PasswordInput
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            hasError={!!clientError && clientError.includes('match')}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {success && (
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
