import { NextRequest } from 'next/server';
import { registerSchema } from '@/utils/validation';
import { hashPassword } from '@/lib/auth';
import { getOne, transaction } from '@/lib/db';
import { success, error, serverError } from '@/lib/api-response';
import type { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return error(parsed.error.errors[0].message);
    }

    const data = parsed.data;

    const existing = await getOne<User>(
      'SELECT id FROM users WHERE email = ? OR phone = ?',
      [data.email, data.phone]
    );
    if (existing) {
      return error('Account with this email or phone already exists');
    }

    const passwordHash = await hashPassword(data.password);

    await transaction(async (conn) => {
      const [userResult] = await conn.execute(
        'INSERT INTO users (role, name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)',
        ['customer', data.name, data.email, data.phone, passwordHash]
      );
      const userId = (userResult as { insertId: number }).insertId;

      await conn.execute(
        'INSERT INTO customers (user_id, customer_type, company_name, address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, data.customer_type, data.company_name || null, data.address, data.city, data.state, data.pincode]
      );
    });

    return success(null, 'Account created successfully', 201);
  } catch (err) {
    console.error('Register error:', err);
    return serverError();
  }
}
