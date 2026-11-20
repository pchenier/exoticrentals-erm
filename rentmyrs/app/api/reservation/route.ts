import { NextRequest, NextResponse, after } from 'next/server';
import { db } from '@/lib/db';
import { notifyTeam } from '@/lib/push';

// Demande de réservation : validation MANUELLE par l'équipe, aucun paiement en ligne.
// Seule la méthode POST existe : rien n'est lisible publiquement ici.


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
  const est = Math.round(Number(body.estimate));
  const estimate = Number.isFinite(est) && est > 0 && est < 1_000_000 ? String(est) : null;
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
    estimate && `Estimate: $${estimate}`,
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
        INSERT INTO booking_requests (name, phone, email, vehicle, start_date, end_date, estimate, message, sms_status)
        VALUES (${name}, ${phone}, ${email || null}, ${`[RentMyRS] ${vehicle}`}, ${startDate}, ${endDate}, ${estimate}, ${message || null}, 'none')
        RETURNING id`;
      savedId = rows[0]?.id ?? null;
    } catch (e) {
      console.error('reservation: DB insert failed', e instanceof Error ? e.message : e);
    }
  }

  // Si la demande n'a pas été enregistrée, le client doit le savoir.
  if (!savedId) {
    console.error('reservation: request NOT SAVED', content);
    return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
  }

  // 2) Notification push sur le téléphone de l'équipe, envoyée après la réponse au client.
  const short = (d: string) => d.slice(5).replace('-', '/');
  after(() =>
    notifyTeam({
      title: `Nouvelle demande · ${vehicle}`,
      body: `${name} · ${phone}\n${short(startDate)} → ${short(endDate)}${estimate ? ` · ~${Number(estimate).toLocaleString('fr-CA')} $` : ''}`,
      url: '/admin',
    }),
  );
  return NextResponse.json({ success: true });
}
