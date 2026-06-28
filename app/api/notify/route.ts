import { NextResponse } from 'next/server';

const OPENPHONE_API_KEY = process.env.OPENPHONE_API_KEY!;
const OPENPHONE_NUMBER = '+14385339053';
const OPENPHONE_NUMBER_ID = 'PNJLnfn2br';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let message = '';

    if (type === 'booking') {
      const { name, phone, vehicle, pickup_date, return_date, notes } = data;
      const days = pickup_date && return_date
        ? Math.ceil((new Date(return_date).getTime() - new Date(pickup_date).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      message = [
        `🚗 NEW BOOKING REQUEST — ERM`,
        ``,
        `Vehicle: ${vehicle}`,
        `Client: ${name}`,
        `Phone: ${phone || 'Not provided'}`,
        `Pickup: ${pickup_date}`,
        `Return: ${return_date}${days ? ` (${days} day${days > 1 ? 's' : ''})` : ''}`,
        notes ? `Notes: ${notes}` : null,
        ``,
        `Reply to confirm or call client directly.`,
      ].filter(Boolean).join('\n');
    } else if (type === 'contact') {
      const { name, phone, message: msg } = data;
      message = `📩 CONTACT FORM — ERM\n\nFrom: ${name}\nPhone: ${phone || 'N/A'}\n\n${msg}`;
    }

    if (!message) {
      return NextResponse.json({ error: 'Unknown notification type' }, { status: 400 });
    }

    const res = await fetch('https://api.openphone.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': OPENPHONE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumberId: OPENPHONE_NUMBER_ID,
        from: OPENPHONE_NUMBER,
        to: [OPENPHONE_NUMBER],
        content: message,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error('OpenPhone API error:', result);
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: result.data?.id });
  } catch (err) {
    console.error('Notify error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
