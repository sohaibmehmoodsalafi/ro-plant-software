import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, isAuth } from '@/middleware/auth-guard';
import { paginated, serverError } from '@/lib/api-response';
import { PAGINATION } from '@/config/constants';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireRole(req, 'admin', 'manager');
    if (!isAuth(auth)) return auth;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );
    const search = searchParams.get('q') || '';
    const offset = (page - 1) * limit;

    let where = 'WHERE u.role = ?';
    const params: unknown[] = ['customer'];

    if (search) {
      where += ' AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ? OR c.city LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    const [customers, countResult] = await Promise.all([
      query(
        `SELECT u.id, u.name, u.email, u.phone, u.status, u.created_at,
                c.id as customer_id, c.customer_type, c.company_name, c.address, c.city, c.pincode
         FROM users u
         JOIN customers c ON c.user_id = u.id
         ${where}
         ORDER BY u.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      ),
      query<[{ total: number }]>(
        `SELECT COUNT(*) as total FROM users u JOIN customers c ON c.user_id = u.id ${where}`,
        params
      ),
    ]);

    const total = countResult[0].total;

    return paginated(customers as unknown[], {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Customers list error:', err);
    return serverError();
  }
}
