'use client';

import { useEffect, useState, useCallback } from 'react';
import { Truck, Filter } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/format';

interface Delivery {
  id: number;
  customer_name: string;
  customer_phone: string;
  address: string;
  city: string;
  staff_name: string | null;
  plan_name: string;
  unit_label: string;
  quantity: number;
  scheduled_date: string;
  scheduled_time_slot: string;
  status: string;
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter) params.set('status', statusFilter);
    if (dateFilter) params.set('date', dateFilter);

    const res = await fetch(`/api/deliveries?${params}`);
    const data = await res.json();
    if (data.success) {
      setDeliveries(data.data);
      setTotalPages(data.pagination.total_pages);
    }
    setLoading(false);
  }, [page, statusFilter, dateFilter]);

  useEffect(() => { fetchDeliveries(); }, [fetchDeliveries]);

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (row: Delivery) => <span className="font-mono text-xs">#{row.id}</span>,
    },
    {
      key: 'customer_name',
      header: 'Customer',
      render: (row: Delivery) => (
        <div>
          <p className="font-medium text-gray-900">{row.customer_name}</p>
          <p className="text-xs text-gray-500">{row.address}, {row.city}</p>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (row: Delivery) => `${row.quantity} × ${row.unit_label}`,
    },
    {
      key: 'scheduled_date',
      header: 'Date',
      render: (row: Delivery) => (
        <div>
          <p>{formatDate(row.scheduled_date)}</p>
          <p className="text-xs text-gray-500">{row.scheduled_time_slot}</p>
        </div>
      ),
    },
    {
      key: 'staff_name',
      header: 'Assigned To',
      render: (row: Delivery) => row.staff_name || <span className="text-gray-400">Unassigned</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Delivery) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deliveries</h1>
          <p className="text-sm text-gray-500">Track and manage all deliveries</p>
        </div>
        <Button size="sm">
          <Truck className="h-4 w-4" /> Generate Today&apos;s Schedule
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          className="input-field w-auto"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="assigned">Assigned</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          className="input-field w-auto"
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
        />
        {(statusFilter || dateFilter) && (
          <Button variant="ghost" size="sm" onClick={() => { setStatusFilter(''); setDateFilter(''); setPage(1); }}>
            <Filter className="h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={deliveries}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
        emptyMessage="No deliveries found"
      />
    </div>
  );
}
