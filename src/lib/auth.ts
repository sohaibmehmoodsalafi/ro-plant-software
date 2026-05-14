import 'server-only';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getOne } from './db';
import { verifyToken, createToken, createRefreshToken } from './jwt';
import type { User } from '@/types';

export { createToken, createRefreshToken, verifyToken };

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return getOne<User>('SELECT * FROM users WHERE id = ? AND status = ?', [
    payload.userId,
    'active',
  ]);
}
