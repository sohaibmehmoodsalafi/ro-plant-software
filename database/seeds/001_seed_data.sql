USE ro_delivery;

-- Admin user (password: Admin@123 - bcrypt hash)
INSERT INTO users (role, name, email, phone, password_hash, status, email_verified) VALUES
('admin', 'Super Admin', 'admin@rodelivery.com', '+929000000001', '$2b$10$placeholder_hash_for_admin_password', 'active', TRUE),
('manager', 'Rajesh Kumar', 'rajesh@rodelivery.com', '+929000000002', '$2b$10$placeholder_hash_for_manager_password', 'active', TRUE);

-- Sample delivery staff
INSERT INTO users (role, name, email, phone, password_hash, status, email_verified) VALUES
('delivery_staff', 'Suresh Yadav', 'suresh@rodelivery.com', '+929000000010', '$2b$10$placeholder_hash', 'active', TRUE),
('delivery_staff', 'Ramesh Patel', 'ramesh@rodelivery.com', '+929000000011', '$2b$10$placeholder_hash', 'active', TRUE);

INSERT INTO delivery_staff (user_id, vehicle_number, vehicle_type, assigned_zone, max_deliveries_per_day) VALUES
(3, 'MH-12-AB-1234', 'Three Wheeler', 'Zone A - Central', 40),
(4, 'MH-12-CD-5678', 'Mini Truck', 'Zone B - East', 50);

-- Sample customers
INSERT INTO users (role, name, email, phone, password_hash, status, email_verified) VALUES
('customer', 'Amit Sharma', 'amit@example.com', '+929000000100', '$2b$10$placeholder_hash', 'active', TRUE),
('customer', 'Priya Enterprises', 'priya@enterprise.com', '+929000000101', '$2b$10$placeholder_hash', 'active', TRUE);

INSERT INTO customers (user_id, customer_type, company_name, address, city, state, pincode, latitude, longitude) VALUES
(5, 'residential', NULL, '42, MG Road, Apt 301', 'Pune', 'Maharashtra', '411001', 18.5204, 73.8567),
(6, 'commercial', 'Priya Enterprises', '15, IT Park, Hinjewadi Phase 1', 'Pune', 'Maharashtra', '411057', 18.5912, 73.7390);

-- Water Plans
INSERT INTO plans (name, description, price_per_unit, unit_label, unit_volume_liters, min_quantity, max_quantity, frequency) VALUES
('Daily Essential', 'Daily delivery of 20L RO water cans for homes', 40.00, '20L Can', 20.00, 1, 5, 'daily'),
('Office Pack', 'Daily bulk delivery for offices and commercial spaces', 35.00, '20L Can', 20.00, 5, 50, 'daily'),
('Alternate Day Saver', 'Alternate day delivery - best value for small families', 42.00, '20L Can', 20.00, 1, 5, 'alternate_days'),
('Weekly Bulk', 'Weekly delivery with bulk pricing', 38.00, '20L Can', 20.00, 5, 30, 'weekly'),
('1L Premium Bottle', 'Premium 1L bottles for events and retail', 15.00, '1L Bottle', 1.00, 12, 200, 'custom');

-- Zones
INSERT INTO zones (name, city, pincodes) VALUES
('Zone A - Central', 'Pune', '["411001", "411002", "411004", "411005"]'),
('Zone B - East', 'Pune', '["411006", "411014", "411036"]'),
('Zone C - West', 'Pune', '["411057", "411045", "411033"]');

-- Sample subscriptions
INSERT INTO subscriptions (customer_id, plan_id, quantity_per_delivery, frequency, preferred_time_slot, start_date, status) VALUES
(1, 1, 2, 'daily', '06:00-09:00', '2026-05-01', 'active'),
(2, 2, 10, 'daily', '08:00-11:00', '2026-05-01', 'active');
