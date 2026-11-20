import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { RS_MODELS } from '@/lib/fleet';
import { getFleet, invalidateFleetCache, isStatus, writeOverride } from '@/lib/fleet-store';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET : la flotte RS telle qu'affichée (défauts + réglages admin).
export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    return NextResponse.json(
      { models: await getFleet({ strict: true }), dbConfigured: !!db() },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erreur' }, { status: 503 });
  }
}

const toInt = (v: unknown) => {
  if (v === null || v === '' || v === undefined) return null;
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 && n < 1_000_000 ? n : NaN;
};

// PUT { id, dailyRate, deposit, status, images } : enregistre les réglages d'un modèle.
export async function PUT(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  const model = RS_MODELS.find((m) => m.id === body.id);
  const dailyRate = toInt(body.dailyRate);
  const deposit = toInt(body.deposit);
  const images = Array.isArray(body.images)
    ? body.images.filter((u): u is string => typeof u === 'string' && /^(https:\/\/|\/cars\/)/.test(u)).slice(0, 12)
    : null;
  const videos = Array.isArray(body.videos)
    ? body.videos.filter((u): u is string => typeof u === 'string' && /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//.test(u)).slice(0, 12)
    : null;
  const focuses: Record<string, string> = {};
  if (body.focuses && typeof body.focuses === 'object') {
    for (const [k, v] of Object.entries(body.focuses as Record<string, unknown>)) {
      if (images?.includes(k) && typeof v === 'string' && /^\d{1,3}% \d{1,3}%$/.test(v)) focuses[k] = v;
    }
  }
  const sp = (body.specs ?? {}) as Record<string, unknown>;
  const hp = Math.round(Number(sp.hp));
  const z = String(sp.zeroTo100 ?? '').trim().replace(',', '.').replace(/\s*s$/, '');
  const specs = {
    ...(Number.isFinite(hp) && hp > 0 && hp < 3000 ? { hp } : {}),
    ...(/^\d{1,2}(\.\d{1,2})?$/.test(z) ? { zeroTo100: `${z} s` } : {}),
  };
  const txt = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const t = (body.texts ?? {}) as Record<string, Record<string, unknown> | undefined>;
  const texts = {
    tagline: { fr: txt(t.tagline?.fr, 160), en: txt(t.tagline?.en, 160) },
    intro: { fr: txt(t.intro?.fr, 2000), en: txt(t.intro?.en, 2000) },
  };
  if (!model || Number.isNaN(dailyRate) || Number.isNaN(deposit) || !isStatus(body.status)) {
    return NextResponse.json({ error: 'Champs invalides' }, { status: 400 });
  }
  try {
    await writeOverride({ id: model.id, daily_rate: dailyRate, deposit, status: body.status, images, texts, videos, focuses, specs });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erreur base de données' }, { status: 503 });
  }
  invalidateFleetCache();
  revalidatePath('/', 'layout');
  return NextResponse.json({ success: true });
}
