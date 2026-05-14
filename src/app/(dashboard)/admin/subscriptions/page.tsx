'use client';

import { useEffect, useState, useCallback } from 'react';
import { Package, Filter } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '@/utils/format';

interface Subscription {
  id: number;
  customer_name: string;
  plan_name: string;
  price_per_unit: number;
  unit_label: string;
  quantity_per_delivery: number;
  frequency: string;
  preferred_time_slot: string;
  start_date: string;
  end_date: string | null;
  status: string;
  auto_renew: boolean;
  city: string;
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter) params.set('status', statusFilter);

    const res = await fetch(`/api/subscriptions?${params}`);
    const data = await res.json();
    if (data.success) {
      setSubs(data.data);
      setTotalPages(data.pagination.total_pages);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const columns = [
    {
      key: 'customer_name',
      header: 'Customer',
      render: (row: Subscription) => (
        <div>
          <p className="font-medium text-gray-900">{row.customer_name}</p>
          <p className="text-xs text-gray-500">{row.city}</p>
        </div>
      ),
    },
    {
      key: 'plan_name',
      header: 'Plan',
      render: (row: Subscription) => (
        <div>
          <p className="font-medium">{row.plan_name}</p>
          <p className="text-xs text-gray-500">{formatCurrency(row.price_per_unit)}/{row.unit_label}</p>
        </div>
      ),
    },
    {
      key: 'quantity_per_delivery',
      header: 'Qty',
      render: (row: Subscription) => `${row.quantity_per_delivery} × ${row.unit_label}`,
    },
    {
      key: 'frequency',
      header: 'Frequency',
      render: (row: Subscription) => (
        <span className="capitalize">{row.frequency.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'start_date',
      header: 'Started',
      render: (row: Subscription) => formatDate(row.start_date),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Subscription) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-sm text-gray-500">Manage customer subscriptions</p>
        </div>
        <Button size="sm">
          <Package className="h-4 w-4" /> New Subscription
        </Button>
      </div>

      <div className="mb-4 flex gap-3">
        <select
          className="input-field w-auto"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>
        {statusFilter && (
          <Button variant="ghost" size="sm" onClick={() => { setStatusFilter(''); setPage(1); }}>
            <Filter className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={subs}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
}
