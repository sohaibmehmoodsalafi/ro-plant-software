// ============================================
// API Route Planning
// ============================================

export const API_ROUTES = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',           // POST
    REGISTER: '/api/auth/register',     // POST
    LOGOUT: '/api/auth/logout',         // POST
    REFRESH: '/api/auth/refresh',       // POST
    FORGOT_PASSWORD: '/api/auth/forgot-password', // POST
    RESET_PASSWORD: '/api/auth/reset-password',   // POST
    VERIFY_EMAIL: '/api/auth/verify-email',       // POST
    ME: '/api/auth/me',                 // GET
  },

  // Customers
  CUSTOMERS: {
    LIST: '/api/customers',             // GET (admin)
    GET: '/api/customers/:id',          // GET
    CREATE: '/api/customers',           // POST
    UPDATE: '/api/customers/:id',       // PUT
    DELETE: '/api/customers/:id',       // DELETE
    SEARCH: '/api/customers/search',    // GET ?q=
    ADDRESSES: '/api/customers/:id/addresses', // GET
  },

  // Plans
  PLANS: {
    LIST: '/api/plans',                 // GET (public)
    GET: '/api/plans/:id',              // GET
    CREATE: '/api/plans',               // POST (admin)
    UPDATE: '/api/plans/:id',           // PUT (admin)
    TOGGLE: '/api/plans/:id/toggle',    // PATCH (admin)
  },

  // Subscriptions
  SUBSCRIPTIONS: {
    LIST: '/api/subscriptions',         // GET
    GET: '/api/subscriptions/:id',      // GET
    CREATE: '/api/subscriptions',       // POST
    UPDATE: '/api/subscriptions/:id',   // PUT
    PAUSE: '/api/subscriptions/:id/pause',     // PATCH
    RESUME: '/api/subscriptions/:id/resume',   // PATCH
    CANCEL: '/api/subscriptions/:id/cancel',   // PATCH
    BY_CUSTOMER: '/api/subscriptions/customer/:id', // GET
  },

  // Deliveries
  DELIVERIES: {
    LIST: '/api/deliveries',            // GET
    GET: '/api/deliveries/:id',         // GET
    CREATE: '/api/deliveries',          // POST (auto-generated)
    UPDATE_STATUS: '/api/deliveries/:id/status', // PATCH
    ASSIGN: '/api/deliveries/:id/assign',       // PATCH
    BULK_ASSIGN: '/api/deliveries/bulk-assign',  // POST
    TODAY: '/api/deliveries/today',      // GET
    BY_STAFF: '/api/deliveries/staff/:id', // GET
    BY_CUSTOMER: '/api/deliveries/customer/:id', // GET
    PROOF: '/api/deliveries/:id/proof',  // POST (upload)
    SCHEDULE: '/api/deliveries/schedule', // POST (generate schedule)
  },

  // Staff
  STAFF: {
    LIST: '/api/staff',                 // GET (admin)
    GET: '/api/staff/:id',              // GET
    CREATE: '/api/staff',               // POST (admin)
    UPDATE: '/api/staff/:id',           // PUT
    TOGGLE_AVAILABILITY: '/api/staff/:id/availability', // PATCH
    UPDATE_LOCATION: '/api/staff/:id/location',         // PATCH
    PERFORMANCE: '/api/staff/:id/performance',          // GET
  },

  // Billing & Payments
  PAYMENTS: {
    INVOICES: '/api/payments/invoices',             // GET
    INVOICE_GET: '/api/payments/invoices/:id',      // GET
    INVOICE_CREATE: '/api/payments/invoices/generate', // POST
    INVOICE_SEND: '/api/payments/invoices/:id/send',   // POST
    PAY: '/api/payments/pay',                       // POST
    HISTORY: '/api/payments/history',               // GET
    BY_CUSTOMER: '/api/payments/customer/:id',      // GET
    RECEIPT: '/api/payments/receipt/:id',            // GET
  },

  // Live Tracking
  TRACKING: {
    STAFF_LOCATION: '/api/tracking/staff/:id',       // GET (real-time)
    DELIVERY_STATUS: '/api/tracking/delivery/:id',   // GET
    UPDATE_LOCATION: '/api/tracking/location',       // POST
    ROUTE: '/api/tracking/route/:staffId',           // GET (today's route)
  },

  // Reports (Admin)
  REPORTS: {
    DASHBOARD: '/api/reports/dashboard',       // GET
    REVENUE: '/api/reports/revenue',           // GET ?from=&to=
    DELIVERIES: '/api/reports/deliveries',     // GET ?from=&to=
    CUSTOMERS: '/api/reports/customers',       // GET
    STAFF_PERFORMANCE: '/api/reports/staff',   // GET
    EXPORT: '/api/reports/export',             // POST (CSV/PDF)
  },
} as const;

// ============================================
// Role-based Access Matrix
// ============================================
export const ROLE_PERMISSIONS = {
  admin: {
    customers: ['create', 'read', 'update', 'delete'],
    plans: ['create', 'read', 'update', 'delete'],
    subscriptions: ['create', 'read', 'update', 'delete'],
    deliveries: ['create', 'read', 'update', 'delete', 'assign'],
    staff: ['create', 'read', 'update', 'delete'],
    invoices: ['create', 'read', 'update', 'delete', 'send'],
    payments: ['read', 'create', 'refund'],
    reports: ['read', 'export'],
    settings: ['read', 'update'],
  },
  manager: {
    customers: ['read', 'update'],
    plans: ['read'],
    subscriptions: ['create', 'read', 'update'],
    deliveries: ['create', 'read', 'update', 'assign'],
    staff: ['read', 'update'],
    invoices: ['create', 'read', 'send'],
    payments: ['read', 'create'],
    reports: ['read'],
    settings: ['read'],
  },
  delivery_staff: {
    deliveries: ['read', 'update'],
    tracking: ['read', 'update'],
    customers: ['read'],
  },
  customer: {
    subscriptions: ['create', 'read', 'update'],
    deliveries: ['read'],
    invoices: ['read'],
    payments: ['read', 'create'],
    tracking: ['read'],
    profile: ['read', 'update'],
  },
} as const;
