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

// redirects non-super_admin roles to the section they have access to
function getDefaultAdminRoute(role: UserRole): string {
  if (role === 'product_admin') return '/admin/plants';
  if (role === 'order_admin' || role === 'delivery_admin') return '/admin/orders';
  if (role === 'user_admin') return '/admin/users';
  return '/admin';
}

// formats ISO date to readable string e.g. "7 May 2026"
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

// formats number to Indian currency e.g. "₹1,50,000"
const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

// ─── Stat card icons ──────────────────────────────────────────────────────────

function UsersStatIcon() {
  return (
    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-2a4 4 0 00-5.924-3.516M9 20H4v-2a4 4 0 015.924-3.516M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function PlantsStatIcon() {
  return (
    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 22V12m0 0C12 6 7 4 3 6c0 5 3 8 9 6zm0 0c0-6 5-8 9-6-1 5-4 8-9 6z" />
    </svg>
  );
}

function OrdersStatIcon() {
  return (
    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4m-8-4l8 4" />
    </svg>
  );
}

function RevenueStatIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 8h6m-6 4h4m-4 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-4 bg-green-500 rounded-full" />
      <h2 className="text-sm font-bold text-gray-700">{children}</h2>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-sm text-gray-400 font-medium">{message}</p>
    </div>
  );
}

function StatCard({ label, value, accent, icon }: { label: string; value: string; accent: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        <p className={`mt-1 text-3xl font-bold ${accent}`}>{value}</p>
      </div>
      <div className="mt-0.5 p-2.5 rounded-xl bg-gray-50 shrink-0">
        {icon}
      </div>
    </div>
  );
}

function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard label="Total Users"  value={String(stats.totalUsers)}          accent="text-blue-600"    icon={<UsersStatIcon />} />
      <StatCard label="Total Plants" value={String(stats.totalPlants)}         accent="text-green-600"   icon={<PlantsStatIcon />} />
      <StatCard label="Total Orders" value={String(stats.totalOrders)}         accent="text-amber-600"   icon={<OrdersStatIcon />} />
      <StatCard label="Revenue"      value={formatCurrency(stats.totalRevenue)} accent="text-emerald-600" icon={<RevenueStatIcon />} />
    </div>
  );
}

function OrdersByStatusRow({ stats }: { stats: DashboardStats }) {
  const { booked, delivered, picked } = stats.ordersByStatus;
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg shrink-0">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-700">{booked}</p>
          <p className="text-xs text-blue-500 font-medium">Booked</p>
        </div>
      </div>
      <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-3">
        <div className="p-2 bg-amber-100 rounded-lg shrink-0">
          <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M8 7h.01M12 7h.01M16 7h.01M9 13h6M9 17h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-amber-700">{delivered}</p>
          <p className="text-xs text-amber-500 font-medium">Delivered</p>
        </div>
      </div>
      <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg shrink-0">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-700">{picked}</p>
          <p className="text-xs text-green-500 font-medium">Returned</p>
        </div>
      </div>
    </div>
  );
}

function RecentOrdersTable({ orders }: { orders: DashboardRecentOrder[] }) {
  if (orders.length === 0) return <EmptyState message="No recent orders." />;

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
    return <EmptyState message="All plants are well stocked." />;

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
    return <EmptyState message="No orders yet." />;

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
  const { data, isLoading, isError } = useAdminDashboard();

  // non-super_admin roles can't see the dashboard — redirect them to their section
  if (role && role !== 'super_admin') {
    return <Navigate to={getDefaultAdminRoute(role)} replace />;
  }

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
              <SectionHeader>Recent Orders</SectionHeader>
              <RecentOrdersTable orders={data.data.recentOrders} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <SectionHeader>Low Stock Plants</SectionHeader>
                <LowStockList plants={data.data.lowStockPlants} />
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <SectionHeader>Top Plants</SectionHeader>
                <TopPlantsList plants={data.data.topPlants} />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
