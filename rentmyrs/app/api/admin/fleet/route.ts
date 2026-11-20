import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { RS_MODELS } from '@/lib/fleet';
import { getFleet, isStatus, writeOverride } from '@/lib/fleet-store';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET : la flotte RS telle qu'affichée (défauts + réglages admin).
export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json(
    { models: await getFleet(), dbConfigured: !!db() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
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
    await writeOverride({ id: model.id, daily_rate: dailyRate, deposit, status: body.status, images, texts });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erreur base de données' }, { status: 503 });
  }
  revalidatePath('/', 'layout');
  return NextResponse.json({ success: true });
}
