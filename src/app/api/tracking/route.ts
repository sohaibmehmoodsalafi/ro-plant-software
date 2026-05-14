import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { authenticate, isAuth } from '@/middleware/auth-guard';
import { success, error, serverError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!isAuth(auth)) return auth;

    if (auth.role !== 'delivery_staff') {
      return error('Only delivery staff can update location', 403);
    }

    const { latitude, longitude, delivery_id } = await req.json();

    if (!latitude || !longitude) {
      return error('Latitude and longitude are required');
    }

    await Promise.all([
      query(
        `UPDATE delivery_staff SET current_latitude = ?, current_longitude = ?, last_location_update = NOW()
         WHERE user_id = ?`,
        [latitude, longitude, auth.userId]
      ),
      query(
        'INSERT INTO location_updates (staff_id, delivery_id, latitude, longitude) VALUES ((SELECT id FROM delivery_staff WHERE user_id = ?), ?, ?, ?)',
        [auth.userId, delivery_id || null, latitude, longitude]
      ),
    ]);

    return success(null, 'Location updated');
  } catch (err) {
    console.error('Location update error:', err);
    return serverError();
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!isAuth(auth)) return auth;

    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get('staff_id');

    if (staffId) {
      const locations = await query(
        `SELECT l.*, u.name as staff_name
         FROM location_updates l
         JOIN delivery_staff ds ON ds.id = l.staff_id
         JOIN users u ON u.id = ds.user_id
         WHERE ds.id = ? AND DATE(l.timestamp) = CURDATE()
         ORDER BY l.timestamp DESC
         LIMIT 50`,
        [staffId]
      );
      return success(locations);
    }

    const allStaff = await query(
      `SELECT ds.id, u.name, ds.current_latitude, ds.current_longitude, ds.last_location_update, ds.is_available,
              (SELECT COUNT(*) FROM deliveries d WHERE d.staff_id = ds.id AND d.scheduled_date = CURDATE() AND d.status = 'delivered') as completed,
              (SELECT COUNT(*) FROM deliveries d WHERE d.staff_id = ds.id AND d.scheduled_date = CURDATE()) as total
       FROM delivery_staff ds
       JOIN users u ON u.id = ds.user_id
       WHERE ds.is_available = TRUE`
    );

    return success(allStaff);
  } catch (err) {
    console.error('Tracking error:', err);
    return serverError();
  }
}
