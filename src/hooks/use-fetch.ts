'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ApiResponse } from '@/types';

interface UseFetchOptions {
  immediate?: boolean;
}

export function useFetch<T>(url: string, options: UseFetchOptions = { immediate: true }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (overrideUrl?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(overrideUrl || url);
      const json: ApiResponse<T> = await res.json();
      if (json.success) {
        setData(json.data ?? null);
      } else {
        setError(json.error || 'Request failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (options.immediate) execute();
  }, [execute, options.immediate]);

  return { data, loading, error, refetch: execute };
}

export async function apiPost<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiPatch<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}
