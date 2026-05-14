import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { unauthorized, forbidden } from '@/lib/api-response';
import type { UserRole } from '@/types';

interface AuthResult {
  userId: number;
  role: UserRole;
}

export async function authenticate(req: NextRequest): Promise<AuthResult | ReturnType<typeof unauthorized>> {
  const token = req.cookies.get('auth_token')?.value
    || req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) return unauthorized();

  const payload = await verifyToken(token);
  if (!payload) return unauthorized('Invalid or expired token');

  return { userId: payload.userId, role: payload.role as UserRole };
}

export function isAuth(result: unknown): result is AuthResult {
  return typeof result === 'object' && result !== null && 'userId' in result;
}

export async function requireRole(req: NextRequest, ...roles: UserRole[]) {
  const auth = await authenticate(req);
  if (!isAuth(auth)) return auth;
  if (!roles.includes(auth.role)) return forbidden();
  return auth;
}
