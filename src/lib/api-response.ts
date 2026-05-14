import { NextResponse } from 'next/server';
import type { ApiResponse, PaginationMeta } from '@/types';

export function success<T>(data: T, message?: string, status = 200) {
  const body: ApiResponse<T> = { success: true, data, message };
  return NextResponse.json(body, { status });
}

export function paginated<T>(
  data: T[],
  pagination: PaginationMeta,
  message?: string
) {
  const body: ApiResponse<T[]> = { success: true, data, pagination, message };
  return NextResponse.json(body, { status: 200 });
}

export function error(message: string, status = 400) {
  const body: ApiResponse = { success: false, error: message };
  return NextResponse.json(body, { status });
}

export function unauthorized(message = 'Unauthorized') {
  return error(message, 401);
}

export function forbidden(message = 'Forbidden') {
  return error(message, 403);
}

export function notFound(message = 'Not found') {
  return error(message, 404);
}

export function serverError(message = 'Internal server error') {
  return error(message, 500);
}
