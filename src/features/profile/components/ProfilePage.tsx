import { useProfile } from '../hooks/profileQueries';
import ProfileInfoSection from './ProfileInfoSection';
import ChangePasswordSection from './ChangePasswordSection';
import AddressesSection from './AddressesSection';

// Anchor nav links that let users jump between page sections.
const NAV_ITEMS = [
  { href: '#profile-info', label: 'Profile Info' },
  { href: '#change-password', label: 'Change Password' },
  { href: '#addresses', label: 'Addresses' },
];

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-6 bg-gray-200 rounded w-1/4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-10 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { isLoading } = useProfile();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky section nav */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto">
            {NAV_ITEMS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="shrink-0 text-sm font-medium text-gray-600 px-4 py-3.5 hover:text-green-700 hover:bg-green-50 rounded-t transition"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-12">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account details and delivery addresses</p>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : (
          <>
            {/* White card wrapper for each section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <ProfileInfoSection />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <ChangePasswordSection />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <AddressesSection />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
