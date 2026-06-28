import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    await sql`ALTER TABLE fleet ADD COLUMN IF NOT EXISTS image_position TEXT;`;
    return NextResponse.json({
      success: true,
      message: 'fleet.image_position column ready (TEXT, nullable).',
    });
  } catch (err) {
    console.error('GET /api/fleet/setup-image-position error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
