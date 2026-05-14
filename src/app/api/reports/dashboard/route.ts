import { NextRequest } from 'next/server';
import { query, getOne } from '@/lib/db';
import { requireRole, isAuth } from '@/middleware/auth-guard';
import { success, serverError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireRole(req, 'admin', 'manager');
    if (!isAuth(auth)) return auth;

    const [customers, activeSubs, todayDeliveries, pendingDeliveries, monthRevenue, outstanding, activeStaff, successRate] = await Promise.all([
      getOne<{ count: number }>('SELECT COUNT(*) as count FROM customers'),
      getOne<{ count: number }>("SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'"),
      getOne<{ count: number }>('SELECT COUNT(*) as count FROM deliveries WHERE scheduled_date = CURDATE()'),
      getOne<{ count: number }>("SELECT COUNT(*) as count FROM deliveries WHERE scheduled_date = CURDATE() AND status IN ('scheduled', 'assigned')"),
      getOne<{ total: number }>("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed' AND MONTH(paid_at) = MONTH(CURDATE()) AND YEAR(paid_at) = YEAR(CURDATE())"),
      getOne<{ total: number }>("SELECT COALESCE(SUM(total_amount), 0) as total FROM invoices WHERE status IN ('sent', 'overdue')"),
      getOne<{ count: number }>("SELECT COUNT(*) as count FROM delivery_staff WHERE is_available = TRUE"),
      query<[{ delivered: number; total: number }]>(
        `SELECT
          SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
          COUNT(*) as total
         FROM deliveries
         WHERE scheduled_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
      ),
    ]);

    const rate = successRate[0];
    const deliveryRate = rate.total > 0 ? Math.round((rate.delivered / rate.total) * 100) : 0;

    return success({
      total_customers: customers?.count || 0,
      active_subscriptions: activeSubs?.count || 0,
      today_deliveries: todayDeliveries?.count || 0,
      pending_deliveries: pendingDeliveries?.count || 0,
      monthly_revenue: monthRevenue?.total || 0,
      outstanding_amount: outstanding?.total || 0,
      active_staff: activeStaff?.count || 0,
      delivery_success_rate: deliveryRate,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return serverError();
  }
}
