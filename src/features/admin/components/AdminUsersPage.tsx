import { useState } from 'react';
import AdminLayout from './AdminLayout';
import AdminModal from './AdminModal';
import ConfirmDialog from './ConfirmDialog';
import CreateAdminForm from './CreateAdminForm';
import TableSkeleton from './TableSkeleton';
import Pagination from './Pagination';
import {
  useAdminUsers,
  useToggleUserStatus,
  useDeleteUser,
  useCreateAdmin,
} from '../hooks/adminQueries';
import { useAppSelector } from '../../../store';
import { useDebounce } from '../../../hooks/useDebounce';
import type { AdminUsersFilters, CreateAdminRequest } from '../types';
import type { UserRole } from '../../auth/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  product_admin: 'Product Admin',
  order_admin: 'Order Admin',
  delivery_admin: 'Delivery Admin',
  user_admin: 'User Admin',
  user: 'User',
};

const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  super_admin: 'bg-purple-100 text-purple-700',
  product_admin: 'bg-green-100 text-green-700',
  order_admin: 'bg-amber-100 text-amber-700',
  delivery_admin: 'bg-blue-100 text-blue-700',
  user_admin: 'bg-pink-100 text-pink-700',
  user: 'bg-gray-100 text-gray-600',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const currentUser = useAppSelector((s) => s.auth.user);
  const role = currentUser?.role;
  const isSuperAdmin = role === 'super_admin';

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [filters, setFilters] = useState<AdminUsersFilters>({ page: 1, limit: 10 });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Merge debounced search into filters
  const queryFilters: AdminUsersFilters = {
    ...filters,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading, isError } = useAdminUsers(queryFilters);
  const { mutate: toggleStatus, isPending: toggling } = useToggleUserStatus();
  const { mutate: removeUser, isPending: deleting } = useDeleteUser();
  const { mutate: createAdmin, isPending: creating } = useCreateAdmin();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const applyRoleFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      role: value ? (value as UserRole) : undefined,
      page: 1,
    }));
  };

  const applyActiveFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      isActive: value === '' ? undefined : value === 'true',
      page: 1,
    }));
  };

  const handleToggleStatus = (userId: string, isActive: boolean) => {
    toggleStatus({ id: userId, body: { isActive: !isActive } });
  };

  const openDeleteConfirm = (userId: string) => {
    setDeletingUserId(userId);
    setConfirmOpen(true);
  };

  const handleDelete = () => {
    if (!deletingUserId) return;
    removeUser(deletingUserId, {
      onSuccess: () => {
        setConfirmOpen(false);
        setDeletingUserId(null);
      },
    });
  };

  const handleCreateAdmin = (formData: CreateAdminRequest) => {
    createAdmin(formData, {
      onSuccess: () => {
        setCreateModalOpen(false);
        setSuccessMessage(
          `Admin account created. Login instructions have been sent to ${formData.email}.`,
        );
        setTimeout(() => setSuccessMessage(''), 5000);
      },
    });
  };

  const users = data?.data.users ?? [];
  const totalPages = data?.data.totalPages ?? 1;

  const selectClass =
    'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white';

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            {data && (
              <p className="text-sm text-gray-500 mt-0.5">
                {data.data.total} user{data.data.total !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {isSuperAdmin && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create Admin
            </button>
          )}
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm flex items-start gap-2.5">
            <svg className="w-4 h-4 mt-0.5 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Search</label>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Name or email..."
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-48"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
              <select
                className={selectClass}
                value={filters.role ?? ''}
                onChange={(e) => applyRoleFilter(e.target.value)}
              >
                <option value="">All roles</option>
                <option value="user">User</option>
                <option value="super_admin">Super Admin</option>
                <option value="product_admin">Product Admin</option>
                <option value="order_admin">Order Admin</option>
                <option value="delivery_admin">Delivery Admin</option>
                <option value="user_admin">User Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
              <select
                className={selectClass}
                value={filters.isActive === undefined ? '' : String(filters.isActive)}
                onChange={(e) => applyActiveFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearch('');
                setFilters({ page: 1, limit: 10 });
              }}
              className="text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        {isLoading && <TableSkeleton rows={10} cols={6} />}

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            Failed to load users. Please try again.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17 20h5v-2a4 4 0 00-5.924-3.516M9 20H4v-2a4 4 0 015.924-3.516M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-400 font-medium">No users found.</p>
                            {(search || filters.role || filters.isActive !== undefined) && (
                              <p className="text-xs text-gray-300">Try adjusting your filters.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => {
                        const isSelf = user._id === currentUser?._id;
                        return (
                          <tr
                            key={user._id}
                            className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-gray-800">
                              {user.name}
                              {isSelf && (
                                <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                  You
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-xs">{user.email}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_BADGE_CLASSES[user.role]}`}
                              >
                                {ROLE_LABELS[user.role]}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  user.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-600'
                                }`}
                              >
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                              {isSelf ? (
                                <span className="text-xs text-gray-300">—</span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                                    disabled={toggling}
                                    className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                      user.isActive
                                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                                        : 'border-green-200 text-green-700 hover:bg-green-50'
                                    }`}
                                  >
                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                  </button>
                                  {isSuperAdmin && (
                                    <button
                                      onClick={() => openDeleteConfirm(user._id)}
                                      className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              page={filters.page ?? 1}
              totalPages={totalPages}
              onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
            />
          </>
        )}
      </div>

      {/* Create admin modal */}
      <AdminModal
        open={createModalOpen}
        title="Create Admin User"
        onClose={() => setCreateModalOpen(false)}
        isLoading={creating}
      >
        <CreateAdminForm onSubmit={handleCreateAdmin} isLoading={creating} />
      </AdminModal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete User"
        message="This user will be soft-deleted and can no longer log in. This action cannot be undone."
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeletingUserId(null);
        }}
      />
    </AdminLayout>
  );
}
