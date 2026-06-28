import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { order } = await request.json() as { order: { id: number; sort_order: number }[] };

    if (!Array.isArray(order)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Update each car's sort_order
    await Promise.all(
      order.map(({ id, sort_order }) =>
        sql`UPDATE fleet SET sort_order = ${sort_order} WHERE id = ${id}`
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/fleet/sort-order error:', err);
    return NextResponse.json({ error: 'Failed to update sort order' }, { status: 500 });
  }
}
