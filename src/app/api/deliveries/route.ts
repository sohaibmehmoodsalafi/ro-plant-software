import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { authenticate, isAuth } from '@/middleware/auth-guard';
import { paginated, serverError } from '@/lib/api-response';
import { PAGINATION } from '@/config/constants';

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!isAuth(auth)) return auth;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const staffId = searchParams.get('staff_id');
    const offset = (page - 1) * limit;

    let where = 'WHERE 1=1';
    const params: unknown[] = [];

    if (auth.role === 'delivery_staff') {
      where += ' AND ds.user_id = ?';
      params.push(auth.userId);
    } else if (auth.role === 'customer') {
      where += ' AND c_user.id = ?';
      params.push(auth.userId);
    }

    if (status) {
      where += ' AND d.status = ?';
      params.push(status);
    }
    if (date) {
      where += ' AND d.scheduled_date = ?';
      params.push(date);
    }
    if (staffId && auth.role !== 'delivery_staff') {
      where += ' AND d.staff_id = ?';
      params.push(staffId);
    }

    const [deliveries, countResult] = await Promise.all([
      query(
        `SELECT d.*, u.name as customer_name, u.phone as customer_phone,
                c.address, c.city, c.pincode, c.latitude, c.longitude,
                su.name as staff_name, p.name as plan_name, p.unit_label
         FROM deliveries d
         JOIN customers c ON c.id = d.customer_id
         JOIN users u ON u.id = c.user_id
         LEFT JOIN users c_user ON c_user.id = c.user_id
         LEFT JOIN delivery_staff ds ON ds.id = d.staff_id
         LEFT JOIN users su ON su.id = ds.user_id
         JOIN subscriptions s ON s.id = d.subscription_id
         JOIN plans p ON p.id = s.plan_id
         ${where}
         ORDER BY d.scheduled_date DESC, d.scheduled_time_slot ASC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      ),
      query<[{ total: number }]>(
        `SELECT COUNT(*) as total
         FROM deliveries d
         JOIN customers c ON c.id = d.customer_id
         JOIN users u ON u.id = c.user_id
         LEFT JOIN users c_user ON c_user.id = c.user_id
         LEFT JOIN delivery_staff ds ON ds.id = d.staff_id
         JOIN subscriptions s ON s.id = d.subscription_id
         JOIN plans p ON p.id = s.plan_id
         ${where}`,
        params
      ),
    ]);

    const total = countResult[0].total;

    return paginated(deliveries as unknown[], {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Deliveries list error:', err);
    return serverError();
  }
}
