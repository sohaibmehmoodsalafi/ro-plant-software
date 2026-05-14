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
    const offset = (page - 1) * limit;

    let where = 'WHERE 1=1';
    const params: unknown[] = [];

    if (auth.role === 'customer') {
      where += ' AND c_user.id = ?';
      params.push(auth.userId);
    }

    const status = searchParams.get('status');
    if (status) {
      where += ' AND i.status = ?';
      params.push(status);
    }

    const [invoices, countResult] = await Promise.all([
      query(
        `SELECT i.*, u.name as customer_name, u.email as customer_email
         FROM invoices i
         JOIN customers c ON c.id = i.customer_id
         JOIN users u ON u.id = c.user_id
         LEFT JOIN users c_user ON c_user.id = c.user_id
         ${where}
         ORDER BY i.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      ),
      query<[{ total: number }]>(
        `SELECT COUNT(*) as total
         FROM invoices i
         JOIN customers c ON c.id = i.customer_id
         JOIN users u ON u.id = c.user_id
         LEFT JOIN users c_user ON c_user.id = c.user_id
         ${where}`,
        params
      ),
    ]);

    const total = countResult[0].total;
    return paginated(invoices as unknown[], { page, limit, total, total_pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Payments list error:', err);
    return serverError();
  }
}
