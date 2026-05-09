import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordApi } from '../utils/authApi';
import PasswordInput from '../../../components/PasswordInput';
import BackButton from '../../../components/BackButton';

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  // The raw reset token is passed as a query param by the link in the reset email.
  // The backend will SHA-256 hash it and compare against the stored digest.
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  // Guard: if the user lands here without a token (e.g. direct navigation),
  // show a clear error with a link to request a new reset email.
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
          <p className="text-red-600 mb-4">Invalid or missing reset token.</p>
          <Link to="/forgot-password" className="text-green-600 text-sm font-medium hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    setApiError('');
    try {
      await resetPasswordApi({ token, newPassword: data.newPassword });
      setSuccess(true);
      // Redirect to login after a brief pause so the user sees the success message.
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Reset failed. The link may have expired.';
      setApiError(msg);
    }
  };

  // Success screen — replaces the form to prevent a second submission.
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Password reset!</h2>
          <p className="text-sm text-gray-500">Redirecting you to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <BackButton className="mb-4" />
        <div className="text-center mb-8">
          <span className="text-4xl">🔒</span>
          <h1 className="mt-2 text-2xl font-semibold text-gray-800">Set new password</h1>
          <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <PasswordInput
              hasError={!!errors.newPassword}
              {...register('newPassword', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <PasswordInput
              hasError={!!errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === watch('newPassword') || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-medium rounded-lg py-2.5 text-sm transition flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {isSubmitting ? 'Resetting…' : 'Reset password'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
