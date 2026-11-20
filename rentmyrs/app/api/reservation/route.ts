import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SITE } from '@/lib/site';

// Demande de réservation : validation MANUELLE par l'équipe, aucun paiement en ligne.
// Seule la méthode POST existe : rien n'est lisible publiquement ici.

const OPENPHONE_API_KEY = process.env.OPENPHONE_API_KEY || '';
const OPENPHONE_NUMBER_ID = process.env.OPENPHONE_NUMBER_ID || '';

// Limite simple par IP (par instance) contre le spam.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Pot de miel rempli = robot. On répond « ok » sans rien faire.
  if (str(body.website, 200)) return NextResponse.json({ success: true });

  const name = str(body.name, 100);
  const phone = str(body.phone, 30);
  const email = str(body.email, 150);
  const vehicle = str(body.vehicle, 60) || 'Not specified';
  const startDate = str(body.startDate, 10);
  const endDate = str(body.endDate, 10);
  const message = str(body.message, 1000);
  const locale = body.locale === 'en' ? 'en' : 'fr';

  if (!name || phone.replace(/\D/g, '').length < 7 || !isDate(startDate) || !isDate(endDate) || endDate < startDate) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  const content = [
    '🏁 RENTMYRS BOOKING REQUEST',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    email && `Email: ${email}`,
    `Lang: ${locale.toUpperCase()}`,
    '',
    `Vehicle: ${vehicle}`,
    `Pickup: ${startDate}`,
    `Return: ${endDate}`,
    message && `Notes: ${message}`,
  ]
    .filter(Boolean)
    .join('\n');

  // 1) Enregistrer d'abord (même table que exoticrentalsmontreal.com, visible dans son admin).
  let savedId: string | null = null;
  const sql = db();
  if (sql) {
    try {
      const rows = await sql`
        INSERT INTO booking_requests (name, phone, email, vehicle, start_date, end_date, message, sms_status)
        VALUES (${name}, ${phone}, ${email || null}, ${`[RentMyRS] ${vehicle}`}, ${startDate}, ${endDate}, ${message || null}, 'pending')
        RETURNING id`;
      savedId = rows[0]?.id ?? null;
    } catch (e) {
      console.error('reservation: DB insert failed', e instanceof Error ? e.message : e);
    }
  }

  // 2) Prévenir l'équipe par SMS.
  let smsSent = false;
  if (OPENPHONE_API_KEY && OPENPHONE_NUMBER_ID) {
    try {
      const res = await fetch('https://api.openphone.com/v1/messages', {
        method: 'POST',
        headers: { Authorization: OPENPHONE_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumberId: OPENPHONE_NUMBER_ID, from: SITE.phone, to: [SITE.phone], content }),
      });
      smsSent = res.ok;
      if (!res.ok) console.error('reservation: OpenPhone error', res.status);
    } catch (e) {
      console.error('reservation: OpenPhone failed', e instanceof Error ? e.message : e);
    }
  }

  if (sql && savedId) {
    try {
      await sql`UPDATE booking_requests SET sms_status = ${smsSent ? 'sent' : 'failed'} WHERE id = ${savedId}`;
    } catch {
      /* best-effort */
    }
  }

  // Si la demande n'a été ni enregistrée ni envoyée, le client doit le savoir.
  if (!savedId && !smsSent) {
    console.error('reservation: request LOST (no DB, no SMS)', content);
    return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
  }
  return NextResponse.json({ success: true });
}
