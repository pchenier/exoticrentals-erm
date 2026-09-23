import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

const OPENPHONE_API_KEY = process.env.OPENPHONE_API_KEY || '';
const ERM_PHONE = '+14388094417';
const ERM_NUMBER_ID = process.env.OPENPHONE_NUMBER_ID || 'PND9VDWaez';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, vehicle, startDate, endDate, estimate, message } = body as {
      name?: string; phone?: string; email?: string; vehicle?: string;
      startDate?: string; endDate?: string; estimate?: string; message?: string;
    };

    if (!name || !phone || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lines = [
      '🏁 ERM BOOKING REQUEST',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : '',
      '',
      `Vehicle: ${vehicle || 'Not specified'}`,
      `Pickup: ${startDate}`,
      `Return: ${endDate}`,
      estimate ? `Estimate: $${estimate}` : '',
      message ? `Notes: ${message}` : '',
    ].filter(Boolean);

    const content = lines.join('\n');

    // PERSIST FIRST (2026-09-26): every booking lands in booking_requests
    // BEFORE the SMS is attempted. The June outage (empty API key → silent
    // 502, zero trace) must never lose a lead again — even a total OpenPhone
    // failure leaves the request readable in the admin Bookings tab.
    let savedId: string | null = null;
    try {
      const { rows } = await sql`
        INSERT INTO booking_requests (name, phone, email, vehicle, start_date, end_date, estimate, message, sms_status)
        VALUES (${name}, ${phone}, ${email ?? null}, ${vehicle ?? null}, ${startDate}, ${endDate}, ${estimate ?? null}, ${message ?? null}, 'pending')
        RETURNING id
      `;
      savedId = rows[0]?.id ?? null;
    } catch (dbErr: unknown) {
      const dbMessage = dbErr instanceof Error ? dbErr.message : String(dbErr);
      console.error('Booking DB persist failed (SMS continues):', dbMessage);
    }

    if (!OPENPHONE_API_KEY) {
      console.error('OPENPHONE_API_KEY not set — booking saved to DB only');
      if (savedId) {
        try {
          await sql`UPDATE booking_requests SET sms_status = 'failed', sms_error = 'no api key' WHERE id = ${savedId}`;
        } catch { /* best-effort */ }
      }
      // The request IS saved — do not make the guest see an error.
      return NextResponse.json({ success: true, persisted: !!savedId, sms: false });
    }

    const res = await fetch('https://api.openphone.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': OPENPHONE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumberId: ERM_NUMBER_ID,
        from: ERM_PHONE,
        to: [ERM_PHONE],
        content,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('OpenPhone API error:', res.status, errText);
      if (savedId) {
        try {
          await sql`UPDATE booking_requests SET sms_status = 'failed', sms_error = ${`HTTP ${res.status}`} WHERE id = ${savedId}`;
        } catch { /* best-effort */ }
      }
      // Saved in DB → the guest's request is not lost; still report success
      // so the guest is never blocked, the admin sees it in Bookings.
      return NextResponse.json({ success: true, persisted: !!savedId, sms: false });
    }

    const data = await res.json();
    if (savedId) {
      try {
        await sql`UPDATE booking_requests SET sms_status = 'sent' WHERE id = ${savedId}`;
      } catch { /* best-effort */ }
    }
    return NextResponse.json({ success: true, messageId: data?.data?.id, persisted: !!savedId, sms: true });
  } catch (e: any) {
    console.error('Booking API error:', e.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}