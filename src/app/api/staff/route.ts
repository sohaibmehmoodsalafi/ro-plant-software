import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, isAuth } from '@/middleware/auth-guard';
import { success, serverError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireRole(req, 'admin', 'manager');
    if (!isAuth(auth)) return auth;

    const staff = await query(
      `SELECT ds.*, u.name, u.email, u.phone, u.status,
              (SELECT COUNT(*) FROM deliveries d WHERE d.staff_id = ds.id AND d.scheduled_date = CURDATE()) as today_deliveries,
              (SELECT COUNT(*) FROM deliveries d WHERE d.staff_id = ds.id AND d.status = 'delivered' AND d.scheduled_date = CURDATE()) as today_completed
       FROM delivery_staff ds
       JOIN users u ON u.id = ds.user_id
       ORDER BY u.name ASC`
    );

    return success(staff);
  } catch (err) {
    console.error('Staff list error:', err);
    return serverError();
  }
}
