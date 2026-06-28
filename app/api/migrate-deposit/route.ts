import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await sql`ALTER TABLE fleet ADD COLUMN IF NOT EXISTS deposit INTEGER DEFAULT 0`;

    const updates = [
      { name: 'Audi RS5', deposit: 5000 },
      { name: 'Audi RS6', deposit: 5000 },
      { name: 'Audi RS7', deposit: 5000 },
      { name: 'BMW M5 Competition', deposit: 5000 },
      { name: 'BMW X5 M Competition', deposit: 5000 },
      { name: 'Audi R8', deposit: 10000 },
      { name: 'Mercedes G63 AMG', deposit: 10000 },
      { name: 'McLaren 600LT', deposit: 10000 },
      { name: 'Lamborghini Urus', deposit: 5000 },
    ];

    const results = [];
    for (const u of updates) {
      const { rows } = await sql`
        UPDATE fleet SET deposit = ${u.deposit}
        WHERE name ILIKE ${'%' + u.name + '%'}
        RETURNING name, deposit
      `;
      if (rows.length) results.push(rows[0]);
    }

    return NextResponse.json({ ok: true, updated: results });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
