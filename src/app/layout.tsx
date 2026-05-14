import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'AquaPure Delivery - Pure RO Water Delivered',
  description: 'Premium RO water delivery service for homes and businesses. Subscribe to daily, weekly, or custom delivery plans.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
