'use client';

import { useEffect, useState } from 'react';
import { Package, Truck, CreditCard, Clock } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/badge';
import { formatDate } from '@/utils/format';

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

interface Delivery {
  id: number;
  quantity: number;
  unit_label: string;
  scheduled_date: string;
  scheduled_time_slot: string;
  status: string;
  plan_name: string;
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/deliveries?limit=5').then((r) => r.json()),
    ])
      .then(([userData, delData]) => {
        if (userData.success) setUser(userData.data);
        if (delData.success) setDeliveries(delData.data);
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

  const todayDeliveries = deliveries.filter(
    (d) => d.scheduled_date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name || 'Customer'}
        </h1>
        <p className="text-sm text-gray-500">Manage your water delivery subscription</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Plans" value={deliveries.length > 0 ? 1 : 0} icon={Package} color="blue" />
        <StatCard title="Today's Delivery" value={todayDeliveries.length} icon={Truck} color="green" />
        <StatCard title="This Month" value={deliveries.length} icon={Clock} color="yellow" />
        <StatCard title="Pending Bills" value={0} icon={CreditCard} color="red" />
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Deliveries</h2>
        {deliveries.length === 0 ? (
          <p className="py-8 text-center text-gray-400">No deliveries yet. Subscribe to a plan to get started!</p>
        ) : (
          <div className="space-y-3">
            {deliveries.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {d.quantity} × {d.unit_label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(d.scheduled_date)} · {d.scheduled_time_slot}
                  </p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
