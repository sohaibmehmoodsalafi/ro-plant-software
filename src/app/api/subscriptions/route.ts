import { NextRequest } from 'next/server';
import { query, getOne, transaction } from '@/lib/db';
import { authenticate, isAuth } from '@/middleware/auth-guard';
import { subscriptionSchema } from '@/utils/validation';
import { success, error, paginated, serverError } from '@/lib/api-response';
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
    const offset = (page - 1) * limit;

    let where = 'WHERE 1=1';
    const params: unknown[] = [];

    if (auth.role === 'customer') {
      where += ' AND c_user.id = ?';
      params.push(auth.userId);
    }

    const status = searchParams.get('status');
    if (status) {
      where += ' AND s.status = ?';
      params.push(status);
    }

    const [subs, countResult] = await Promise.all([
      query(
        `SELECT s.*, p.name as plan_name, p.price_per_unit, p.unit_label,
                u.name as customer_name, c.address, c.city
         FROM subscriptions s
         JOIN plans p ON p.id = s.plan_id
         JOIN customers c ON c.id = s.customer_id
         JOIN users u ON u.id = c.user_id
         LEFT JOIN users c_user ON c_user.id = c.user_id
         ${where}
         ORDER BY s.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      ),
      query<[{ total: number }]>(
        `SELECT COUNT(*) as total
         FROM subscriptions s
         JOIN customers c ON c.id = s.customer_id
         JOIN users u ON u.id = c.user_id
         LEFT JOIN users c_user ON c_user.id = c.user_id
         ${where}`,
        params
      ),
    ]);

    const total = countResult[0].total;
    return paginated(subs as unknown[], { page, limit, total, total_pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Subscriptions list error:', err);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!isAuth(auth)) return auth;

    const body = await req.json();
    const parsed = subscriptionSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.errors[0].message);

    const d = parsed.data;

    const customer = await getOne<{ id: number }>(
      'SELECT c.id FROM customers c JOIN users u ON u.id = c.user_id WHERE u.id = ?',
      [auth.userId]
    );
    if (!customer) return error('Customer profile not found');

    await transaction(async (conn) => {
      await conn.execute(
        `INSERT INTO subscriptions (customer_id, plan_id, quantity_per_delivery, frequency, custom_days, preferred_time_slot, start_date, auto_renew)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customer.id, d.plan_id, d.quantity_per_delivery, d.frequency,
          d.custom_days ? JSON.stringify(d.custom_days) : null,
          d.preferred_time_slot, d.start_date, d.auto_renew,
        ]
      );
    });

    return success(null, 'Subscription created', 201);
  } catch (err) {
    console.error('Subscription create error:', err);
    return serverError();
  }
}
