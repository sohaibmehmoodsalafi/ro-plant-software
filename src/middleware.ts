import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const publicPaths = [
  '/',
  '/about',
  '/plans',
  '/contact',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/plans',
];

const roleRoutes: Record<string, string[]> = {
  admin: ['/admin'],
  manager: ['/admin'],
  delivery_staff: ['/delivery'],
  customer: ['/customer'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicPaths.some((p) => pathname === p || pathname.startsWith('/api/plans'))) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('auth_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('auth_token');
    return response;
  }

  const allowedPrefixes = roleRoutes[payload.role] || [];
  const isAllowed = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isAllowed && (pathname.startsWith('/admin') || pathname.startsWith('/delivery') || pathname.startsWith('/customer'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|icons).*)'],
};
