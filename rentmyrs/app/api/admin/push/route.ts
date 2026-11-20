import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { countSubs, deleteSub, isPushSub, notifyTeam, saveSub, vapidPublicKey } from '@/lib/push';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const noStore = { headers: { 'Cache-Control': 'no-store' } };

// GET : clé publique VAPID + nombre d'appareils inscrits.
export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json(
    { publicKey: db() ? await vapidPublicKey() : null, devices: db() ? await countSubs() : 0, dbConfigured: !!db() },
    noStore,
  );
}

// POST { subscription, label } : inscrit cet appareil. POST { test: true } : notification d'essai.
export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  if (body.test === true) {
    const r = await notifyTeam({ title: 'RentMyRS', body: 'Notification test ✓ Les demandes de réservation arriveront ici.' });
    return NextResponse.json(r, noStore);
  }
  if (!isPushSub(body.subscription)) return NextResponse.json({ error: 'Bad subscription' }, { status: 400 });
  const ok = await saveSub(body.subscription, typeof body.label === 'string' ? body.label : '');
  return ok ? NextResponse.json({ success: true }, noStore) : NextResponse.json({ error: 'Database not configured' }, { status: 503 });
}

// DELETE { endpoint } : désinscrit cet appareil.
export async function DELETE(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const body = (await req.json().catch(() => ({}))) as { endpoint?: unknown };
  if (typeof body.endpoint === 'string') await deleteSub(body.endpoint);
  return NextResponse.json({ success: true }, noStore);
}
