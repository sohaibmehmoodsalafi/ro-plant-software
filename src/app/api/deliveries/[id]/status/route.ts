import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { authenticate, isAuth } from '@/middleware/auth-guard';
import { deliveryStatusSchema } from '@/utils/validation';
import { success, error, serverError } from '@/lib/api-response';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticate(req);
    if (!isAuth(auth)) return auth;

    const { id } = await params;
    const body = await req.json();
    const parsed = deliveryStatusSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.errors[0].message);

    const { status, notes, failure_reason } = parsed.data;

    const updates: string[] = ['status = ?'];
    const values: unknown[] = [status];

    if (status === 'delivered') {
      updates.push('delivered_at = NOW()');
    }
    if (notes) {
      updates.push('notes = ?');
      values.push(notes);
    }
    if (failure_reason) {
      updates.push('failure_reason = ?');
      values.push(failure_reason);
    }

    values.push(id);
    await query(`UPDATE deliveries SET ${updates.join(', ')} WHERE id = ?`, values);

    return success(null, 'Delivery status updated');
  } catch (err) {
    console.error('Delivery status update error:', err);
    return serverError();
  }
}
