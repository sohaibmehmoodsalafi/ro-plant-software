'use client';

import { useEffect, useState } from 'react';
import { StatusBadge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/utils/format';

interface Invoice {
  id: number;
  amount: number;
  due_date: string;
  status: string;
  plan_name: string;
  created_at: string;
}

export default function CustomerBilling() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payments?limit=20')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setInvoices(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Billing</h1>

      {invoices.length === 0 ? (
        <div className="card py-12 text-center text-gray-400">No invoices yet</div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <div key={inv.id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{formatCurrency(inv.amount)}</p>
                <p className="text-sm text-gray-500">{inv.plan_name}</p>
                <p className="mt-1 text-xs text-gray-400">
                  Due: {formatDate(inv.due_date)}
                </p>
              </div>
              <StatusBadge status={inv.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
