import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, isAuth } from '@/middleware/auth-guard';
import { planSchema } from '@/utils/validation';
import { success, error, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const plans = await query('SELECT * FROM plans WHERE is_active = TRUE ORDER BY price_per_unit ASC');
    return success(plans);
  } catch (err) {
    console.error('Plans list error:', err);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole(req, 'admin');
    if (!isAuth(auth)) return auth;

    const body = await req.json();
    const parsed = planSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.errors[0].message);

    const d = parsed.data;
    await query(
      `INSERT INTO plans (name, description, price_per_unit, unit_label, unit_volume_liters, min_quantity, max_quantity, frequency)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.name, d.description || null, d.price_per_unit, d.unit_label, d.unit_volume_liters, d.min_quantity, d.max_quantity, d.frequency]
    );

    return success(null, 'Plan created', 201);
  } catch (err) {
    console.error('Plan create error:', err);
    return serverError();
  }
}
