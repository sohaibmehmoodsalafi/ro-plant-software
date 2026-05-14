import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+\d{1,4}\d{7,12}$/, 'Invalid phone number with country code (e.g. +923001234567)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  customer_type: z.enum(['residential', 'commercial']).default('residential'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{4,10}$/, 'Pincode must be 4-10 digits'),
  company_name: z.string().optional(),
});

export const subscriptionSchema = z.object({
  plan_id: z.number().positive(),
  quantity_per_delivery: z.number().min(1),
  frequency: z.enum(['daily', 'alternate_days', 'weekly', 'custom']),
  custom_days: z.array(z.string()).optional(),
  preferred_time_slot: z.string(),
  start_date: z.string(),
  auto_renew: z.boolean().default(true),
});

export const deliveryStatusSchema = z.object({
  status: z.enum(['scheduled', 'assigned', 'out_for_delivery', 'delivered', 'failed', 'cancelled']),
  notes: z.string().optional(),
  failure_reason: z.string().optional(),
});

export const planSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price_per_unit: z.number().positive(),
  unit_label: z.string().default('20L Can'),
  unit_volume_liters: z.number().positive().default(20),
  min_quantity: z.number().min(1).default(1),
  max_quantity: z.number().min(1).default(50),
  frequency: z.enum(['daily', 'alternate_days', 'weekly', 'custom']),
});
