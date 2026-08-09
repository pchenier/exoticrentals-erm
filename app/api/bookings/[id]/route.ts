import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      car_name, client_name, client_phone, pickup_date, return_date,
      deposit_status, payment_status, total_price, drop_off_location,
      notes, referral, status
    } = body;

    await sql`
      UPDATE bookings SET
        car_name = ${car_name},
        client_name = ${client_name},
        client_phone = ${client_phone},
        pickup_date = ${pickup_date},
        return_date = ${return_date},
        deposit_status = ${deposit_status},
        payment_status = ${payment_status},
        total_price = ${total_price},
        drop_off_location = ${drop_off_location},
        notes = ${notes},
        referral = ${referral},
        status = ${status}
      WHERE id = ${id}
    `;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  await sql`DELETE FROM bookings WHERE id = ${numId}`;
  return NextResponse.json({ ok: true });
}