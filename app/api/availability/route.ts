import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const car = searchParams.get('car');

  if (!car) {
    return NextResponse.json({ error: 'car param required' }, { status: 400 });
  }

  const { rows } = await sql`
    SELECT pickup_date::text, return_date::text
    FROM bookings
    WHERE LOWER(car_name) = LOWER(${car})
      AND status != 'cancelled'
      AND return_date >= CURRENT_DATE
    ORDER BY pickup_date ASC
  `;

  return NextResponse.json({ bookedRanges: rows });
}
