import { NextRequest } from 'next/server';
import { loginSchema } from '@/utils/validation';
import { verifyPassword, createToken, createRefreshToken } from '@/lib/auth';
import { getOne, query } from '@/lib/db';
import { success, error, serverError } from '@/lib/api-response';
import type { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return error(parsed.error.errors[0].message);
    }

    const { email, password } = parsed.data;

    const user = await getOne<User>(
      'SELECT * FROM users WHERE email = ? AND status = ?',
      [email, 'active']
    );

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return error('Invalid email or password', 401);
    }

    const token = await createToken({ userId: user.id, role: user.role });
    const refreshToken = await createRefreshToken({ userId: user.id });

    await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    const response = success({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      token,
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return error(`Server error: ${message}`, 500);
  }
}
