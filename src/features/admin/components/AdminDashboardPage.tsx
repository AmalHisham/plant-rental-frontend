import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../store';
import { useAdminDashboard } from '../hooks/adminQueries';
import AdminLayout from './AdminLayout';
import StatusBadge from './StatusBadge';
import type { UserRole } from '../../auth/types';
import type {
  DashboardStats,
  DashboardRecentOrder,
  DashboardLowStockPlant,
  DashboardTopPlant,
} from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDefaultAdminRoute(role: UserRole): string {
  if (role === 'product_admin') return '/admin/plants';
  if (role === 'order_admin' || role === 'delivery_admin') return '/admin/orders';
  if (role === 'user_admin') return '/admin/users';
  return '/admin';
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard label="Total Users" value={String(stats.totalUsers)} accent="text-blue-600" />
      <StatCard label="Total Plants" value={String(stats.totalPlants)} accent="text-green-600" />
      <StatCard label="Total Orders" value={String(stats.totalOrders)} accent="text-amber-600" />
      <StatCard label="Revenue" value={formatCurrency(stats.totalRevenue)} accent="text-emerald-600" />
    </div>
  );
}

function OrdersByStatusRow({ stats }: { stats: DashboardStats }) {
  const { booked, delivered, picked } = stats.ordersByStatus;
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-50 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-blue-700">{booked}</p>
        <p className="text-xs text-blue-500 mt-0.5 font-medium">Booked</p>
      </div>
      <div className="bg-amber-50 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-amber-700">{delivered}</p>
        <p className="text-xs text-amber-500 mt-0.5 font-medium">Delivered</p>
      </div>
      <div className="bg-green-50 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-green-700">{picked}</p>
        <p className="text-xs text-green-500 mt-0.5 font-medium">Returned</p>
      </div>
    </div>
  );
}

function RecentOrdersTable({ orders }: { orders: DashboardRecentOrder[] }) {
  if (orders.length === 0) return <p className="text-sm text-gray-400 py-4">No recent orders.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2.5 font-mono text-xs text-gray-500">
                #{o._id.slice(-8)}
              </td>
              <td className="px-3 py-2.5">
                <p className="font-medium text-gray-800">{o.userId.name}</p>
                <p className="text-xs text-gray-400">{o.userId.email}</p>
              </td>
              <td className="px-3 py-2.5 font-semibold text-gray-800">
                {formatCurrency(o.totalPrice)}
              </td>
              <td className="px-3 py-2.5">
                <StatusBadge value={o.status} />
              </td>
              <td className="px-3 py-2.5 text-xs text-gray-500">{formatDate(o.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LowStockList({ plants }: { plants: DashboardLowStockPlant[] }) {
  if (plants.length === 0)
    return <p className="text-sm text-gray-400 py-4">All plants are well stocked.</p>;

  return (
    <ul className="space-y-2">
      {plants.map((p) => (
        <li key={p._id} className="flex items-center justify-between py-2 border-b border-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-800">{p.name}</p>
            <p className="text-xs text-gray-400">{p.category}</p>
          </div>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {p.stock} left
          </span>
        </li>
      ))}
    </ul>
  );
}

function TopPlantsList({ plants }: { plants: DashboardTopPlant[] }) {
  if (plants.length === 0)
    return <p className="text-sm text-gray-400 py-4">No orders yet.</p>;

  return (
    <ol className="space-y-2">
      {plants.map((p, i) => (
        <li key={p.plantId} className="flex items-center gap-3 py-2 border-b border-gray-50">
          <span className="text-lg font-bold text-gray-300 w-5 text-center">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
            <p className="text-xs text-gray-400">{p.category}</p>
          </div>
          <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
            {p.totalOrdered} rented
          </span>
        </li>
      ))}
    </ol>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 h-24" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-16" />
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 h-48" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const role = useAppSelector((s) => s.auth.user?.role);

  // Redirect non-super_admin roles to their appropriate section.
  if (role && role !== 'super_admin') {
    return <Navigate to={getDefaultAdminRoute(role)} replace />;
  }

  const { data, isLoading, isError } = useAdminDashboard();

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of your plant rental platform</p>
        </div>

        {isLoading && <DashboardSkeleton />}

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            Failed to load dashboard data. Please refresh the page.
          </div>
        )}

        {data && (
          <div className="space-y-6">
            <StatsGrid stats={data.data} />
            <OrdersByStatusRow stats={data.data} />

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-700 mb-4">Recent Orders</h2>
              <RecentOrdersTable orders={data.data.recentOrders} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-700 mb-4">Low Stock Plants</h2>
                <LowStockList plants={data.data.lowStockPlants} />
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-700 mb-4">Top Plants</h2>
                <TopPlantsList plants={data.data.topPlants} />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
