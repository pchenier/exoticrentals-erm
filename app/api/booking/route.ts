import { NextRequest, NextResponse } from 'next/server';

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

    if (!OPENPHONE_API_KEY) {
      console.error('OPENPHONE_API_KEY not set — booking not sent');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
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
      return NextResponse.json({ error: 'Failed to send booking' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, messageId: data?.data?.id });
  } catch (e: any) {
    console.error('Booking API error:', e.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}