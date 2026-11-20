import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';


// Admin Bookings tab: lists booking_requests (web form submissions, save-first
// pipeline since Sept 26). Session-cookie-gated like the rest of the admin routes.
export async function GET(req: Request) {
  if (!(await isAdmin(req))) {
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
  const id = url.searchParams.get('id') || '';
  if (!(await isAdmin(req)) || !id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await sql`
    DELETE FROM booking_requests WHERE id = ${id}
  `;
  return NextResponse.json({ success: (result.rows?.length ?? 0) > 0 });
}