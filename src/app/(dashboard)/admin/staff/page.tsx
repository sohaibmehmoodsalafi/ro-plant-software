'use client';

import { useEffect, useState } from 'react';
import { UserCheck, Phone, Truck, MapPin } from 'lucide-react';
import { StatusBadge } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  vehicle_number: string;
  vehicle_type: string;
  assigned_zone: string;
  is_available: boolean;
  today_deliveries: number;
  today_completed: number;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/staff')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStaff(data.data);
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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Staff</h1>
          <p className="text-sm text-gray-500">Manage your delivery team</p>
        </div>
        <Button size="sm">
          <UserCheck className="h-4 w-4" /> Add Staff
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <div key={member.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <Phone className="h-3 w-3" /> {member.phone}
                  </p>
                </div>
              </div>
              <Badge variant={member.is_available ? 'success' : 'default'}>
                {member.is_available ? 'Available' : 'Offline'}
              </Badge>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Truck className="h-4 w-4" />
                {member.vehicle_type} · {member.vehicle_number}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                {member.assigned_zone}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{member.today_completed}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{member.today_deliveries}</p>
                <p className="text-xs text-gray-500">Assigned</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-lg font-bold text-primary-600">
                  {member.today_deliveries > 0
                    ? Math.round((member.today_completed / member.today_deliveries) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-gray-500">Rate</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
