export const APP_NAME = 'AquaPure Delivery';
export const APP_DESCRIPTION = 'Pure RO Water Delivered to Your Doorstep';

export const TIME_SLOTS = [
  '06:00-09:00',
  '09:00-12:00',
  '12:00-15:00',
  '15:00-18:00',
  '18:00-21:00',
] as const;

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const INVOICE_PREFIX = 'INV';
export const TAX_RATE = 18; // GST percentage
export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';

export const COUNTRY_CODES = [
  { code: '+92', country: 'PK', label: '🇵🇰 +92', name: 'Pakistan' },
  { code: '+91', country: 'IN', label: '🇮🇳 +91', name: 'India' },
  { code: '+1', country: 'US', label: '🇺🇸 +1', name: 'United States' },
  { code: '+44', country: 'GB', label: '🇬🇧 +44', name: 'United Kingdom' },
  { code: '+971', country: 'AE', label: '🇦🇪 +971', name: 'UAE' },
  { code: '+966', country: 'SA', label: '🇸🇦 +966', name: 'Saudi Arabia' },
  { code: '+880', country: 'BD', label: '🇧🇩 +880', name: 'Bangladesh' },
  { code: '+977', country: 'NP', label: '🇳🇵 +977', name: 'Nepal' },
  { code: '+94', country: 'LK', label: '🇱🇰 +94', name: 'Sri Lanka' },
  { code: '+86', country: 'CN', label: '🇨🇳 +86', name: 'China' },
  { code: '+61', country: 'AU', label: '🇦🇺 +61', name: 'Australia' },
  { code: '+49', country: 'DE', label: '🇩🇪 +49', name: 'Germany' },
] as const;

export const DEFAULT_COUNTRY_CODE = '+92';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const DELIVERY_STATUS_COLORS: Record<string, string> = {
  scheduled: '#6B7280',
  assigned: '#3B82F6',
  out_for_delivery: '#F59E0B',
  delivered: '#10B981',
  failed: '#EF4444',
  cancelled: '#9CA3AF',
};

export const SUBSCRIPTION_STATUS_COLORS: Record<string, string> = {
  active: '#10B981',
  paused: '#F59E0B',
  cancelled: '#EF4444',
  expired: '#9CA3AF',
};
