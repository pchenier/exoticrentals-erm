import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// Public endpoint — returns plain text availability summary for OpenPhone AI assistant
export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get all active fleet
    const { rows: fleet } = await sql`SELECT id, name, rate, deposit FROM fleet WHERE coming_soon = false ORDER BY sort_order ASC`;

    // Get upcoming/active bookings
    const { rows: bookings } = await sql`
      SELECT car_name, pickup_date, return_date, status
      FROM bookings
      WHERE return_date >= ${today}
        AND status NOT IN ('cancelled')
      ORDER BY pickup_date ASC
    `;

    // Build unavailability map
    const unavailable: Record<string, { from: string; to: string }[]> = {};
    for (const b of bookings) {
      if (!unavailable[b.car_name]) unavailable[b.car_name] = [];
      unavailable[b.car_name].push({
        from: b.pickup_date?.toString().split('T')[0] ?? '',
        to: b.return_date?.toString().split('T')[0] ?? '',
      });
    }

    const lines: string[] = [
      `EXOTIC RENTALS MONTREAL — AVAILABILITY SUMMARY`,
      `Updated: ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}`,
      ``,
      `FLEET & RATES:`,
    ];

    for (const car of fleet) {
      const blocked = unavailable[car.name] ?? [];
      const status = blocked.length === 0
        ? 'AVAILABLE'
        : `UNAVAILABLE: ${blocked.map(b => `${b.from} to ${b.to}`).join(', ')}`;
      lines.push(`• ${car.name} — $${car.rate}/day | Deposit: $${car.deposit ?? 0} | ${status}`);
    }

    lines.push('');
    lines.push('BOOKING POLICY:');
    lines.push('• Minimum rental: 1 day');
    lines.push('• Deposit is fully refundable upon return');
    lines.push('• Valid driver\'s license + credit card required');
    lines.push('• Delivery available in Montreal area');
    lines.push('• Contact: +1 438-533-9053 | contact@exoticrentalsmontreal.com');

    const summary = lines.join('\n');

    return new NextResponse(summary, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return new NextResponse(`Error generating availability summary: ${String(err)}`, { status: 500 });
  }
}
