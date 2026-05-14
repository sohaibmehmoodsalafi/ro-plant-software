'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Download } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/format';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  customer_type: string;
  company_name: string | null;
  city: string;
  pincode: string;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('q', search);

    const res = await fetch(`/api/customers?${params}`);
    const data = await res.json();
    if (data.success) {
      setCustomers(data.data);
      setTotalPages(data.pagination.total_pages);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      render: (row: Customer) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone' },
    {
      key: 'customer_type',
      header: 'Type',
      render: (row: Customer) => (
        <span className="capitalize">{row.customer_type}</span>
      ),
    },
    { key: 'city', header: 'City' },
    {
      key: 'status',
      header: 'Status',
      render: (row: Customer) => <StatusBadge status={row.status} />,
    },
    {
      key: 'created_at',
      header: 'Joined',
      render: (row: Customer) => formatDate(row.created_at),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">Manage your customer base</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            className="input-field pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
        emptyMessage="No customers found"
      />
    </div>
  );
}
