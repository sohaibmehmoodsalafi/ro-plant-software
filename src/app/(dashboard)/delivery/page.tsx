'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, Phone, MapPin, Navigation } from 'lucide-react';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiPatch } from '@/hooks/use-fetch';

interface DeliveryTask {
  id: number;
  customer_name: string;
  customer_phone: string;
  address: string;
  city: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  quantity: number;
  unit_label: string;
  plan_name: string;
  scheduled_time_slot: string;
  status: string;
  notes: string | null;
}

export default function DeliveryStaffPage() {
  const [deliveries, setDeliveries] = useState<DeliveryTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/deliveries?date=${today}`);
    const data = await res.json();
    if (data.success) setDeliveries(data.data);
    setLoading(false);
  }, [today]);

  useEffect(() => { fetchDeliveries(); }, [fetchDeliveries]);

  async function updateStatus(id: number, status: string) {
    setUpdatingId(id);
    const result = await apiPatch(`/api/deliveries/${id}/status`, { status });
    if (result.success) {
      setDeliveries((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status } : d))
      );
    }
    setUpdatingId(null);
  }

  const stats = {
    total: deliveries.length,
    delivered: deliveries.filter((d) => d.status === 'delivered').length,
    pending: deliveries.filter((d) => ['assigned', 'out_for_delivery'].includes(d.status)).length,
    failed: deliveries.filter((d) => d.status === 'failed').length,
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Today&apos;s Deliveries</h1>
        <p className="text-sm text-gray-500">{today}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg bg-white p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="rounded-lg bg-green-50 p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          <p className="text-xs text-gray-500">Done</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="rounded-lg bg-red-50 p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          <p className="text-xs text-gray-500">Failed</p>
        </div>
      </div>

      {/* Delivery Cards */}
      <div className="space-y-3">
        {deliveries.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-gray-400 shadow-sm">
            No deliveries assigned for today
          </div>
        ) : (
          deliveries.map((delivery) => (
            <div key={delivery.id} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{delivery.customer_name}</p>
                    <StatusBadge status={delivery.status} />
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {delivery.address}, {delivery.city} - {delivery.pincode}
                    </p>
                    <p className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {delivery.customer_phone}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {delivery.scheduled_time_slot} · {delivery.quantity} × {delivery.unit_label}
                    </p>
                  </div>
                </div>

                {delivery.latitude && delivery.longitude && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${delivery.latitude},${delivery.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-primary-100 p-2 text-primary-600"
                  >
                    <Navigation className="h-5 w-5" />
                  </a>
                )}
              </div>

              {!['delivered', 'failed', 'cancelled'].includes(delivery.status) && (
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    loading={updatingId === delivery.id}
                    onClick={() => updateStatus(delivery.id, 'delivered')}
                  >
                    <CheckCircle className="h-4 w-4" /> Delivered
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-1"
                    loading={updatingId === delivery.id}
                    onClick={() => updateStatus(delivery.id, 'failed')}
                  >
                    <XCircle className="h-4 w-4" /> Failed
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
