import { NextResponse } from 'next/server';

export async function GET() {
  const mysql = await import('mysql2/promise');

  const config = {
    host: process.env.DB_HOST || 'not-set',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'not-set',
    password: process.env.DB_PASSWORD ? '***set***' : 'not-set',
    database: process.env.DB_NAME || 'not-set',
    ssl_env: process.env.DB_SSL || 'not-set',
  };

  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '4000'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { minVersion: 'TLSv1.2' },
    });

    const [rows] = await conn.execute('SELECT COUNT(*) as count FROM users');
    await conn.end();

    return NextResponse.json({
      success: true,
      config,
      db_result: rows,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      config,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
