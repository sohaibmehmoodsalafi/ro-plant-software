// ============================================
// User Roles
// ============================================
export type UserRole = 'admin' | 'manager' | 'delivery_staff' | 'customer';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: number;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  avatar_url?: string;
  status: UserStatus;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// Customer
// ============================================
export type CustomerType = 'residential' | 'commercial';

export interface Customer {
  id: number;
  user_id: number;
  customer_type: CustomerType;
  company_name?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  landmark?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// Plans & Subscriptions
// ============================================
export type PlanFrequency = 'daily' | 'alternate_days' | 'weekly' | 'custom';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired';

export interface Plan {
  id: number;
  name: string;
  description: string;
  price_per_unit: number;
  unit_label: string; // e.g., "20L Can", "1L Bottle"
  unit_volume_liters: number;
  min_quantity: number;
  max_quantity: number;
  frequency: PlanFrequency;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: number;
  customer_id: number;
  plan_id: number;
  quantity_per_delivery: number;
  frequency: PlanFrequency;
  custom_days?: string; // JSON array of days: ["mon","wed","fri"]
  preferred_time_slot: string;
  start_date: Date;
  end_date?: Date;
  status: SubscriptionStatus;
  auto_renew: boolean;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// Deliveries
// ============================================
export type DeliveryStatus =
  | 'scheduled'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export interface Delivery {
  id: number;
  subscription_id: number;
  customer_id: number;
  staff_id?: number;
  scheduled_date: Date;
  scheduled_time_slot: string;
  quantity: number;
  status: DeliveryStatus;
  delivered_at?: Date;
  proof_image_url?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// Delivery Staff
// ============================================
export interface DeliveryStaff {
  id: number;
  user_id: number;
  vehicle_number?: string;
  vehicle_type?: string;
  assigned_zone?: string;
  max_deliveries_per_day: number;
  is_available: boolean;
  current_latitude?: number;
  current_longitude?: number;
  last_location_update?: Date;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// Billing & Payments
// ============================================
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'bank_transfer' | 'wallet';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Invoice {
  id: number;
  customer_id: number;
  invoice_number: string;
  billing_period_start: Date;
  billing_period_end: Date;
  total_deliveries: number;
  total_quantity: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: InvoiceStatus;
  due_date: Date;
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: number;
  invoice_id: number;
  customer_id: number;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id?: string;
  status: PaymentStatus;
  paid_at?: Date;
  created_at: Date;
}

// ============================================
// Tracking
// ============================================
export interface LocationUpdate {
  id: number;
  staff_id: number;
  delivery_id?: number;
  latitude: number;
  longitude: number;
  timestamp: Date;
}

// ============================================
// Notifications
// ============================================
export type NotificationType = 'delivery' | 'payment' | 'subscription' | 'system';

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: Date;
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// ============================================
// Dashboard Stats
// ============================================
export interface DashboardStats {
  total_customers: number;
  active_subscriptions: number;
  today_deliveries: number;
  pending_deliveries: number;
  monthly_revenue: number;
  outstanding_amount: number;
  active_staff: number;
  delivery_success_rate: number;
}
