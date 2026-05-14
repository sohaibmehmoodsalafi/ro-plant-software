'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Droplets, Truck, MapPin, LogOut } from 'lucide-react';

const navItems = [
  { href: '/delivery', label: 'My Deliveries', icon: Truck },
  { href: '/delivery/routes', label: 'Route Map', icon: MapPin },
];

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Droplets className="h-7 w-7 text-primary-600" />
            <span className="text-lg font-bold">AquaPure</span>
          </div>
          <button
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
            onClick={() => {
              fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                window.location.href = '/login';
              });
            }}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <div className="mx-auto flex max-w-4xl gap-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-4">{children}</main>
    </div>
  );
}
