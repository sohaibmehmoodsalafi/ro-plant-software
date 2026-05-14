'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CustomerProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProfile(data.data);
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

  if (!profile) {
    return <div className="card py-12 text-center text-gray-400">Could not load profile</div>;
  }

  const fields = [
    { icon: User, label: 'Name', value: profile.name },
    { icon: Mail, label: 'Email', value: profile.email },
    { icon: Phone, label: 'Phone', value: profile.phone },
    {
      icon: MapPin,
      label: 'Address',
      value: [profile.address, profile.city, profile.state, profile.pincode]
        .filter(Boolean)
        .join(', '),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="card space-y-4">
        {fields.map((f) => (
          <div key={f.label} className="flex items-start gap-3">
            <f.icon className="mt-0.5 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">{f.label}</p>
              <p className="text-gray-900">{f.value || '—'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
