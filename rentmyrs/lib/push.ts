import webpush from 'web-push';
import { db } from './db';

// Notifications push vers le téléphone de l'équipe (Web Push, sans application tierce).
// Clés VAPID : VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY si présentes dans Vercel ; sinon une paire est
// générée une seule fois et gardée dans la base (table rentmyrs_settings). Rien à configurer à la main.

let tableReady = false;
async function ensureTable() {
  const sql = db();
  if (!sql) return null;
  if (!tableReady) {
    await sql`
      CREATE TABLE IF NOT EXISTS rentmyrs_push_subs (
        endpoint TEXT PRIMARY KEY,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        label TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    await sql`CREATE TABLE IF NOT EXISTS rentmyrs_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`;
    tableReady = true;
  }
  return sql;
}

let keys: { publicKey: string; privateKey: string } | null = null;
async function vapidKeys() {
  if (keys) return keys;
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    keys = { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY };
    return keys;
  }
  const sql = await ensureTable();
  if (!sql) return null;
  const fresh = webpush.generateVAPIDKeys();
  // ON CONFLICT DO NOTHING : si deux requêtes arrivent en même temps, la première paire gagne.
  await sql`INSERT INTO rentmyrs_settings (key, value) VALUES ('vapid', ${JSON.stringify(fresh)}) ON CONFLICT (key) DO NOTHING`;
  const [row] = await sql`SELECT value FROM rentmyrs_settings WHERE key = 'vapid'`;
  keys = row ? JSON.parse(row.value as string) : null;
  return keys;
}

export async function vapidPublicKey() {
  try {
    return (await vapidKeys())?.publicKey ?? null;
  } catch (e) {
    console.error('push: vapid keys unavailable', e instanceof Error ? e.message : e);
    return null;
  }
}

async function configure() {
  const k = await vapidKeys();
  if (!k) return false;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:admin@rentmyrs.com', k.publicKey, k.privateKey);
  return true;
}

export type PushSub = { endpoint: string; keys: { p256dh: string; auth: string } };

export function isPushSub(v: unknown): v is PushSub {
  const s = v as PushSub;
  return (
    !!s && typeof s.endpoint === 'string' && /^https:\/\//.test(s.endpoint) && s.endpoint.length < 1000 &&
    typeof s.keys?.p256dh === 'string' && s.keys.p256dh.length < 200 &&
    typeof s.keys?.auth === 'string' && s.keys.auth.length < 100
  );
}

export async function saveSub(sub: PushSub, label: string) {
  const sql = await ensureTable();
  if (!sql) return false;
  await sql`
    INSERT INTO rentmyrs_push_subs (endpoint, p256dh, auth, label)
    VALUES (${sub.endpoint}, ${sub.keys.p256dh}, ${sub.keys.auth}, ${label.slice(0, 80) || null})
    ON CONFLICT (endpoint) DO UPDATE SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth, label = EXCLUDED.label`;
  return true;
}

export async function deleteSub(endpoint: string) {
  const sql = await ensureTable();
  if (!sql) return;
  await sql`DELETE FROM rentmyrs_push_subs WHERE endpoint = ${endpoint}`;
}

export async function countSubs() {
  const sql = await ensureTable();
  if (!sql) return 0;
  const [r] = await sql`SELECT count(*)::int AS n FROM rentmyrs_push_subs`;
  return (r?.n as number) ?? 0;
}

/** Envoie la notification à tous les appareils inscrits. Ne lance jamais d'erreur. */
export async function notifyTeam(payload: { title: string; body: string; url?: string }) {
  try {
    if (!(await configure())) return { sent: 0, reason: 'no-vapid' };
    const sql = await ensureTable();
    if (!sql) return { sent: 0, reason: 'no-db' };
    const subs = await sql`SELECT endpoint, p256dh, auth FROM rentmyrs_push_subs`;
    const data = JSON.stringify({ url: '/admin', ...payload });
    let sent = 0;
    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint as string, keys: { p256dh: s.p256dh as string, auth: s.auth as string } },
            data,
            { TTL: 24 * 3600, urgency: 'high' },
          );
          sent++;
        } catch (e) {
          const code = (e as { statusCode?: number }).statusCode;
          // Appareil désinscrit ou abonnement expiré : on le retire.
          if (code === 404 || code === 410) await deleteSub(s.endpoint as string);
          else console.error('push: send failed', code ?? (e instanceof Error ? e.message : e));
        }
      }),
    );
    return { sent };
  } catch (e) {
    console.error('push: notifyTeam failed', e instanceof Error ? e.message : e);
    return { sent: 0, reason: 'error' };
  }
}
