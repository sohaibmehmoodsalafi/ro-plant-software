import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

const variants = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  default: 'bg-gray-100 text-gray-700',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    delivered: { variant: 'success', label: 'Delivered' },
    paid: { variant: 'success', label: 'Paid' },
    completed: { variant: 'success', label: 'Completed' },
    scheduled: { variant: 'info', label: 'Scheduled' },
    assigned: { variant: 'info', label: 'Assigned' },
    sent: { variant: 'info', label: 'Sent' },
    pending: { variant: 'warning', label: 'Pending' },
    paused: { variant: 'warning', label: 'Paused' },
    out_for_delivery: { variant: 'warning', label: 'Out for Delivery' },
    overdue: { variant: 'danger', label: 'Overdue' },
    failed: { variant: 'danger', label: 'Failed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    expired: { variant: 'default', label: 'Expired' },
    inactive: { variant: 'default', label: 'Inactive' },
    draft: { variant: 'default', label: 'Draft' },
  };

  const config = map[status] || { variant: 'default' as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
