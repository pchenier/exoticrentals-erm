import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Drop NOT NULL on legacy columns that conflict with new schema
  await sql`ALTER TABLE bookings ALTER COLUMN car_id DROP NOT NULL`.catch(() => {});
  await sql`ALTER TABLE bookings ALTER COLUMN client_phone DROP NOT NULL`.catch(() => {});
  await sql`ALTER TABLE bookings ALTER COLUMN pickup_date DROP NOT NULL`.catch(() => {});
  await sql`ALTER TABLE bookings ALTER COLUMN return_date DROP NOT NULL`.catch(() => {});
  await sql`ALTER TABLE bookings ALTER COLUMN client_name DROP NOT NULL`.catch(() => {});
  await sql`ALTER TABLE bookings ALTER COLUMN car_name DROP NOT NULL`.catch(() => {});
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS referral TEXT`.catch(() => {});

  // Add all columns idempotently so existing tables are migrated
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS car_name TEXT`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS client_name TEXT`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS client_phone TEXT`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pickup_date DATE`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS return_date DATE`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'confirmed'`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_status TEXT DEFAULT 'pending'`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price NUMERIC(10,2)`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS drop_off_location TEXT`;

  return NextResponse.json({ ok: true });
}
