'use client';

import { useEffect, useState } from 'react';
import { StatusBadge } from '@/components/ui/badge';
import { formatDate } from '@/utils/format';

interface Delivery {
  id: number;
  quantity: number;
  unit_label: string;
  scheduled_date: string;
  scheduled_time_slot: string;
  status: string;
  plan_name: string;
  staff_name: string | null;
}

export default function CustomerDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/deliveries?limit=50')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setDeliveries(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === 'all' ? deliveries : deliveries.filter((d) => d.status === filter);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Deliveries</h1>

      <div className="flex gap-2 overflow-x-auto">
        {['all', 'scheduled', 'in_transit', 'delivered', 'failed'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card py-12 text-center text-gray-400">No deliveries found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <div key={d.id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  {d.quantity} × {d.unit_label}
                </p>
                <p className="text-sm text-gray-500">{d.plan_name}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {formatDate(d.scheduled_date)} · {d.scheduled_time_slot}
                </p>
              </div>
              <StatusBadge status={d.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
