'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Droplets, Package, Truck, CreditCard, User, LogOut } from 'lucide-react';

const navItems = [
  { href: '/customer', label: 'Dashboard', icon: Package },
  { href: '/customer/deliveries', label: 'My Deliveries', icon: Truck },
  { href: '/customer/billing', label: 'Billing', icon: CreditCard },
  { href: '/customer/profile', label: 'Profile', icon: User },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/customer" className="flex items-center gap-2">
            <Droplets className="h-7 w-7 text-primary-600" />
            <span className="text-lg font-bold">AquaPure</span>
          </Link>
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
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors',
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
      <main className="mx-auto max-w-5xl p-4 md:p-6">{children}</main>
    </div>
  );
}
