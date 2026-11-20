import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Demandes de réservation venues de rentmyrs.com (préfixe [RentMyRS] dans vehicle).
export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const sql = db();
  if (!sql) return NextResponse.json({ error: 'POSTGRES_URL non configurée' }, { status: 503 });
  const rows = await sql`
    SELECT id, name, phone, email, vehicle, start_date, end_date, estimate, message, created_at
    FROM booking_requests
    WHERE vehicle LIKE '[RentMyRS]%'
    ORDER BY created_at DESC
    LIMIT 200`;
  return NextResponse.json(rows, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get('id') || '';
  const sql = db();
  if (!id || !sql) return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  // Ne peut supprimer que des demandes RentMyRS.
  await sql`DELETE FROM booking_requests WHERE id = ${id} AND vehicle LIKE '[RentMyRS]%'`;
  return NextResponse.json({ success: true });
}
