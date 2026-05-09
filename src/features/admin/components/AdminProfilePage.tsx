import AdminLayout from './AdminLayout';
import ChangePasswordSection from '../../profile/components/ChangePasswordSection';

export default function AdminProfilePage() {
  return (
    <AdminLayout>
      <div className="p-8 max-w-lg">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h1>
        <ChangePasswordSection />
      </div>
    </AdminLayout>
  );
}
