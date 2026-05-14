'use client';

import { useEffect, useState, useCallback } from 'react';
import { CreditCard, FileText, Filter } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '@/utils/format';

interface Invoice {
  id: number;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  billing_period_start: string;
  billing_period_end: string;
  total_deliveries: number;
  total_quantity: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: string;
  due_date: string;
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter) params.set('status', statusFilter);

    const res = await fetch(`/api/payments?${params}`);
    const data = await res.json();
    if (data.success) {
      setInvoices(data.data);
      setTotalPages(data.pagination.total_pages);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const columns = [
    {
      key: 'invoice_number',
      header: 'Invoice',
      render: (row: Invoice) => (
        <span className="font-mono text-sm font-medium text-primary-600">{row.invoice_number}</span>
      ),
    },
    {
      key: 'customer_name',
      header: 'Customer',
      render: (row: Invoice) => (
        <div>
          <p className="font-medium text-gray-900">{row.customer_name}</p>
          <p className="text-xs text-gray-500">{row.customer_email}</p>
        </div>
      ),
    },
    {
      key: 'period',
      header: 'Billing Period',
      render: (row: Invoice) => (
        <span className="text-sm">
          {formatDate(row.billing_period_start)} - {formatDate(row.billing_period_end)}
        </span>
      ),
    },
    {
      key: 'total_amount',
      header: 'Amount',
      render: (row: Invoice) => (
        <span className="font-medium">{formatCurrency(row.total_amount)}</span>
      ),
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (row: Invoice) => formatDate(row.due_date),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Invoice) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="text-sm text-gray-500">Manage invoices and payments</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <FileText className="h-4 w-4" /> Generate Invoices
          </Button>
          <Button size="sm">
            <CreditCard className="h-4 w-4" /> Record Payment
          </Button>
        </div>
      </div>

      <div className="mb-4 flex gap-3">
        <select
          className="input-field w-auto"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {statusFilter && (
          <Button variant="ghost" size="sm" onClick={() => { setStatusFilter(''); setPage(1); }}>
            <Filter className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
}
