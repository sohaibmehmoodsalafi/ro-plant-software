'use client';

import { useEffect, useState } from 'react';
import { Users, Package, Truck, CreditCard, TrendingUp, UserCheck, Target, AlertCircle } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { formatCurrency } from '@/utils/format';
import type { DashboardStats } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your water delivery operations</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={stats.total_customers}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.active_subscriptions}
          icon={Package}
          color="green"
        />
        <StatCard
          title="Today's Deliveries"
          value={stats.today_deliveries}
          icon={Truck}
          color="yellow"
        />
        <StatCard
          title="Pending Deliveries"
          value={stats.pending_deliveries}
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthly_revenue)}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Outstanding"
          value={formatCurrency(stats.outstanding_amount)}
          icon={CreditCard}
          color="red"
        />
        <StatCard
          title="Active Staff"
          value={stats.active_staff}
          icon={UserCheck}
          color="purple"
        />
        <StatCard
          title="Success Rate"
          value={`${stats.delivery_success_rate}%`}
          icon={Target}
          color="blue"
        />
      </div>
    </div>
  );
}
