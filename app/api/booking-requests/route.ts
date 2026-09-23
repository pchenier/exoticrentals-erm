import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ADMIN_PASSWORD env var is EMPTY on this project (Vercel) — the admin page
// hardcodes the fallback "1666777", so this route must accept the same value.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1666777';

// Admin Bookings tab: lists booking_requests (web form submissions, save-first
// pipeline since Sept 26). Password-gated like the rest of the admin routes.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const password = url.searchParams.get('password') || '';
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { rows } = await sql`
    SELECT id, name, phone, email, vehicle, start_date, end_date, estimate, message, sms_status, sms_error, created_at
    FROM booking_requests
    ORDER BY created_at DESC
    LIMIT 200
  `;
  return NextResponse.json(rows);
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const password = url.searchParams.get('password') || '';
  const id = url.searchParams.get('id') || '';
  if (password !== ADMIN_PASSWORD || !id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await sql`
    DELETE FROM booking_requests WHERE id = ${id}
  `;
  return NextResponse.json({ success: (result.rows?.length ?? 0) > 0 });
}