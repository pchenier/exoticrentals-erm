import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

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
