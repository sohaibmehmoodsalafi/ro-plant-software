import { NextRequest } from 'next/server';
import { authenticate, isAuth } from '@/middleware/auth-guard';
import { getOne } from '@/lib/db';
import { success, serverError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!isAuth(auth)) return auth;

    const user = await getOne(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.avatar_url, u.status,
              c.customer_type, c.company_name, c.address, c.city, c.state, c.pincode
       FROM users u
       LEFT JOIN customers c ON c.user_id = u.id
       WHERE u.id = ?`,
      [auth.userId]
    );

    return success(user);
  } catch (err) {
    console.error('Auth me error:', err);
    return serverError();
  }
}
