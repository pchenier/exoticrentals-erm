import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  const { rows } = await sql`
    SELECT car_name, pickup_date, return_date 
    FROM bookings 
    WHERE return_date >= ${today} AND status != 'cancelled'
    ORDER BY pickup_date ASC
  `;
  return NextResponse.json(rows);
}
