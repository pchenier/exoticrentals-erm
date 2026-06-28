import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { rows } = await sql`
    SELECT * FROM bookings ORDER BY pickup_date DESC
  `;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      car_name,
      client_name,
      client_phone,
      pickup_date,
      return_date,
      notes,
      status,
      deposit_status,
      payment_status,
      total_price,
      drop_off_location,
    referral,
    } = body;

    const { rows } = await sql`
      INSERT INTO bookings (
        car_name, client_name, client_phone, pickup_date, return_date, notes, status,
        deposit_status, payment_status, total_price, drop_off_location, referral
      )
      VALUES (
        ${car_name}, ${client_name}, ${client_phone ?? null}, ${pickup_date}, ${return_date},
        ${notes ?? null}, ${status ?? 'confirmed'},
        ${deposit_status ?? 'pending'}, ${payment_status ?? 'pending'},
        ${total_price ?? null}, ${drop_off_location ?? null}, ${referral ?? null}
      )
      RETURNING *
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('POST /api/bookings error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
