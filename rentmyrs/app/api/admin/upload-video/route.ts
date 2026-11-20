import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// Vidéos : le navigateur envoie le fichier directement à Vercel Blob (pas de limite de 4,5 Mo
// des fonctions). Cette route ne fait que délivrer un jeton d'envoi, réservé à l'admin connecté.
export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Vercel Blob non configuré (BLOB_READ_WRITE_TOKEN)' }, { status: 503 });
  }
  let body: HandleUploadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  if (body.type === 'blob.generate-client-token') {
    const denied = await requireAdmin(req);
    if (denied) return denied;
  }
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith('rentmyrs/videos/')) throw new Error('Chemin invalide');
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
          maximumSizeInBytes: 500 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Échec' }, { status: 400 });
  }
}
