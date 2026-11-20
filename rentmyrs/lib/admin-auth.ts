// Server-side admin authentication.
//
// The admin password lives ONLY in the ADMIN_PASSWORD environment variable
// (Vercel → Project → Settings → Environment Variables). It is never shipped
// to the browser and there is no hardcoded fallback: if the variable is not
// set, every admin route answers 401 and the admin cannot log in.
//
// After a successful login the browser receives an httpOnly cookie holding an
// HMAC of a fixed label keyed with the password. Changing ADMIN_PASSWORD
// therefore logs everybody out. Uses Web Crypto so it works on both the Node
// and Edge runtimes.

export const ADMIN_COOKIE = 'rentmyrs_admin';
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getPassword(): string {
  return process.env.ADMIN_PASSWORD || '';
}

export function adminConfigured(): boolean {
  return getPassword().length > 0;
}

async function hmacHex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function adminToken(): Promise<string> {
  return hmacHex(getPassword(), 'rentmyrs-admin-session-v1');
}

export async function checkPassword(candidate: unknown): Promise<boolean> {
  const pw = getPassword();
  if (!pw || typeof candidate !== 'string' || !candidate) return false;
  // Compare HMACs so the comparison length never depends on the input.
  const [a, b] = await Promise.all([
    hmacHex('rentmyrs-compare', candidate),
    hmacHex('rentmyrs-compare', pw),
  ]);
  return safeEqual(a, b);
}

function readCookie(req: Request, name: string): string {
  const header = req.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return '';
}

export async function isAdmin(req: Request): Promise<boolean> {
  if (!adminConfigured()) return false;
  const cookie = readCookie(req, ADMIN_COOKIE);
  if (!cookie) return false;
  return safeEqual(cookie, await adminToken());
}

export function unauthorized(): Response {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

/** Returns a 401 Response when the caller is not the admin, otherwise null. */
export async function requireAdmin(req: Request): Promise<Response | null> {
  return (await isAdmin(req)) ? null : unauthorized();
}
