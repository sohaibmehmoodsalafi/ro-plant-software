import { CURRENCY_SYMBOL } from '@/config/constants';
import { format, formatDistanceToNow } from 'date-fns';

export function formatCurrency(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'dd MMM yyyy');
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'dd MMM yyyy, hh:mm a');
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatPhone(phone: string): string {
  if (!phone) return '';
  const match = phone.match(/^(\+\d{1,4})(\d+)$/);
  if (match) {
    const [, code, number] = match;
    const mid = Math.ceil(number.length / 2);
    return `${code} ${number.slice(0, mid)} ${number.slice(mid)}`;
  }
  if (phone.length === 10) {
    return `${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  return phone;
}
