import { useState } from 'react';
import AdminLayout from './AdminLayout';
import StatusBadge from './StatusBadge';
import TableSkeleton from './TableSkeleton';
import Pagination from './Pagination';
import {
  useAdminOrders,
  useUpdateOrderStatus,
  useUpdateOrderDamage,
  useUpdateOrderDeposit,
} from '../hooks/adminQueries';
import { useAppSelector } from '../../../store';
import type { AdminOrdersFilters, AdminOrder } from '../types';
import type { OrderStatus, DamageStatus } from '../../orders/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const role = useAppSelector((s) => s.auth.user?.role);

  const canUpdateStatus = role === 'super_admin' || role === 'delivery_admin';
  const canUpdateDamage = role === 'super_admin' || role === 'order_admin';
  const canUpdateDeposit = role === 'super_admin' || role === 'order_admin';

  const [filters, setFilters] = useState<AdminOrdersFilters>({ page: 1, limit: 10 });
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  const { data, isLoading, isError } = useAdminOrders(filters);
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { mutate: updateDamage } = useUpdateOrderDamage();
  const { mutate: updateDeposit } = useUpdateOrderDeposit();

  const applyFilter = (key: keyof AdminOrdersFilters, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  const clearFilters = () => setFilters({ page: 1, limit: 10 });

  const handleStatusChange = (order: AdminOrder, status: OrderStatus) => {
    setPendingOrderId(order._id);
    updateStatus(
      { id: order._id, body: { status } },
      { onSettled: () => setPendingOrderId(null) },
    );
  };

  const handleDamageChange = (order: AdminOrder, damageStatus: DamageStatus) => {
    setPendingOrderId(order._id);
    updateDamage(
      { id: order._id, body: { damageStatus } },
      { onSettled: () => setPendingOrderId(null) },
    );
  };

  const handleDepositToggle = (order: AdminOrder) => {
    setPendingOrderId(order._id);
    updateDeposit(
      { id: order._id, body: { depositRefunded: !order.depositRefunded } },
      { onSettled: () => setPendingOrderId(null) },
    );
  };

  const orders = data?.data.orders ?? [];
  const totalPages = data?.data.totalPages ?? 1;

  const selectClass =
    'text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          {data && (
            <p className="text-sm text-gray-500 mt-0.5">
              {data.data.total} order{data.data.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
              <select
                className={selectClass}
                value={filters.status ?? ''}
                onChange={(e) => applyFilter('status', e.target.value as OrderStatus)}
              >
                <option value="">All</option>
                <option value="booked">Booked</option>
                <option value="delivered">Delivered</option>
                <option value="picked">Returned</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Damage</label>
              <select
                className={selectClass}
                value={filters.damageStatus ?? ''}
                onChange={(e) => applyFilter('damageStatus', e.target.value as DamageStatus)}
              >
                <option value="">All</option>
                <option value="none">None</option>
                <option value="minor">Minor</option>
                <option value="major">Major</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Payment</label>
              <select
                className={selectClass}
                value={filters.paymentStatus ?? ''}
                onChange={(e) => applyFilter('paymentStatus', e.target.value as 'pending' | 'paid' | 'failed')}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">From</label>
              <input
                type="date"
                className={selectClass}
                value={filters.startDate ?? ''}
                onChange={(e) => applyFilter('startDate', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">To</label>
              <input
                type="date"
                className={selectClass}
                value={filters.endDate ?? ''}
                onChange={(e) => applyFilter('endDate', e.target.value)}
              />
            </div>

            <button
              onClick={clearFilters}
              className="text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        {isLoading && <TableSkeleton rows={10} cols={6} />}

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            Failed to load orders. Please try again.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {[
                        'Order',
                        'Customer',
                        'Plants',
                        'Total',
                        'Rental Period',
                        'Status',
                        'Damage',
                        'Payment',
                        'Deposit',
                        canUpdateStatus || canUpdateDamage || canUpdateDeposit ? 'Actions' : null,
                      ]
                        .filter(Boolean)
                        .map((h) => (
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
                    {orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={10}
                          className="px-4 py-10 text-center text-gray-400 text-sm"
                        >
                          No orders match your filters.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => {
                        const isPending = pendingOrderId === order._id;
                        return (
                          <tr
                            key={order._id}
                            className={`border-b border-gray-50 transition-colors ${
                              isPending ? 'opacity-60' : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="px-4 py-3 font-mono text-xs text-gray-500">
                              #{order._id.slice(-8)}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-800">{order.userId.name}</p>
                              <p className="text-xs text-gray-400 truncate max-w-[140px]">
                                {order.userId.email}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-xs max-w-[160px]">
                              {order.plants
                                .map((p) => `${p.plantId.name} ×${p.quantity}`)
                                .join(', ')}
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                              {formatCurrency(order.totalPrice)}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                              {formatDate(order.rentalStartDate)} →{' '}
                              {formatDate(order.rentalEndDate)}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge value={order.status} />
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge value={order.damageStatus} />
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge value={order.paymentStatus} />
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  order.depositRefunded
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {order.depositRefunded ? 'Refunded' : 'Held'}
                              </span>
                            </td>

                            {(canUpdateStatus || canUpdateDamage || canUpdateDeposit) && (
                              <td className="px-4 py-3">
                                <div className="flex flex-col gap-1.5">
                                  {canUpdateStatus && (
                                    <select
                                      className={selectClass}
                                      value={order.status}
                                      disabled={isPending}
                                      onChange={(e) =>
                                        handleStatusChange(order, e.target.value as OrderStatus)
                                      }
                                    >
                                      <option value="booked">Booked</option>
                                      <option value="delivered">Delivered</option>
                                      <option value="picked">Returned</option>
                                    </select>
                                  )}
                                  {canUpdateDamage && (
                                    <select
                                      className={selectClass}
                                      value={order.damageStatus}
                                      disabled={isPending}
                                      onChange={(e) =>
                                        handleDamageChange(order, e.target.value as DamageStatus)
                                      }
                                    >
                                      <option value="none">No Damage</option>
                                      <option value="minor">Minor</option>
                                      <option value="major">Major</option>
                                    </select>
                                  )}
                                  {canUpdateDeposit && (
                                    <button
                                      disabled={isPending}
                                      onClick={() => handleDepositToggle(order)}
                                      className={`text-xs font-medium px-2 py-1 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                        order.depositRefunded
                                          ? 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                          : 'border-green-200 text-green-700 hover:bg-green-50'
                                      }`}
                                    >
                                      {order.depositRefunded ? 'Undo Refund' : 'Mark Refunded'}
                                    </button>
                                  )}
                                </div>
                              </td>
                            )}
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
    </AdminLayout>
  );
}
