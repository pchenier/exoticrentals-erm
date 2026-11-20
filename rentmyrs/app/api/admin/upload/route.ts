import { NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };

// POST multipart (file, model) : téléverse une photo dans Vercel Blob et renvoie son URL.
export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Vercel Blob non configuré (BLOB_READ_WRITE_TOKEN)' }, { status: 503 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  const model = String(form?.get('model') ?? 'rs').replace(/[^a-z0-9]/g, '') || 'rs';
  if (!(file instanceof File) || !TYPES[file.type]) {
    return NextResponse.json({ error: 'Image JPG, PNG, WebP ou AVIF seulement' }, { status: 400 });
  }
  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: 'Image trop lourde (15 Mo max)' }, { status: 400 });
  }
  const blob = await put(`rentmyrs/${model}/${Date.now()}.${TYPES[file.type]}`, file, {
    access: 'public',
    contentType: file.type,
  });
  return NextResponse.json({ url: blob.url });
}

// GET ?model=rs3 : photos déjà téléversées pour ce modèle (pour en remettre une sans la renvoyer).
export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ urls: [] });
  const model = (new URL(req.url).searchParams.get('model') ?? '').replace(/[^a-z0-9]/g, '');
  if (!model) return NextResponse.json({ urls: [] });
  const { blobs } = await list({ prefix: `rentmyrs/${model}/`, limit: 100 });
  return NextResponse.json(
    { urls: blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt)).map((b) => b.url) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
