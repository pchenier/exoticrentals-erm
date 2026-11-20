import { db } from './db';
import { RS_MODELS, type RsModel, type VehicleStatus } from './fleet';

// Réglages modifiables dans /admin, par-dessus les valeurs par défaut de lib/fleet.ts.
export type FleetOverride = {
  id: RsModel['id'];
  daily_rate: number | null;
  deposit: number | null;
  status: VehicleStatus;
  images: string[] | null;
  /** Textes modifiés dans /admin (accroche et description, FR/EN). Vide = texte par défaut. */
  texts?: ModelTexts | null;
  videos?: string[] | null;
  focuses?: Record<string, string> | null;
};

export type ModelTexts = { tagline?: Partial<Record<'fr' | 'en', string>>; intro?: Partial<Record<'fr' | 'en', string>> };

const STATUSES: VehicleStatus[] = ['available', 'unavailable', 'maintenance'];
export const isStatus = (v: unknown): v is VehicleStatus => STATUSES.includes(v as VehicleStatus);

// Création / mise à jour de la table : seulement au moment d'enregistrer, jamais pendant l'affichage.
// (Un ALTER TABLE à chaque démarrage bloquait les lectures et faisait afficher les valeurs par défaut.)
const COLUMNS = ['texts', 'videos', 'focuses'] as const;
let tableReady: Promise<unknown> | null = null;
function ensureTable() {
  const sql = db();
  if (!sql) return null;
  tableReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS rentmyrs_fleet (
        id TEXT PRIMARY KEY,
        daily_rate INTEGER,
        deposit INTEGER,
        status TEXT NOT NULL DEFAULT 'available',
        images JSONB,
        texts JSONB,
        videos JSONB,
        focuses JSONB,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    const have = await sql<{ column_name: string }[]>`
      SELECT column_name FROM information_schema.columns WHERE table_name = 'rentmyrs_fleet'`;
    const missing = COLUMNS.filter((c) => !have.some((h) => h.column_name === c));
    for (const c of missing) {
      await sql.begin(async (tx) => {
        await tx`SET LOCAL lock_timeout = '5s'`;
        await tx.unsafe(`ALTER TABLE rentmyrs_fleet ADD COLUMN IF NOT EXISTS ${c} JSONB`);
      });
    }
  })().catch((e) => {
    tableReady = null;
    throw e;
  });
  return tableReady;
}

/**
 * Réglages /admin. strict = true (admin) : lance une erreur si la base ne répond pas,
 * pour ne jamais afficher (puis réenregistrer) les valeurs par défaut à la place des vraies.
 * Les pages du site sont rendues à la demande (jamais figées au build avec les défauts du code).
 */
// Petit cache par instance (15 s) + dernière lecture réussie, pour ne jamais retomber sur les défauts du code.
let cache: { at: number; rows: FleetOverride[] } | null = null;
export function invalidateFleetCache() {
  cache = null;
}

export async function readOverrides({ strict = false }: { strict?: boolean } = {}): Promise<FleetOverride[]> {
  if (!strict && cache && Date.now() - cache.at < 15_000) return cache.rows;
  try {
    const rows = await readFromDb({ strict });
    cache = { at: Date.now(), rows };
    return rows;
  } catch (e) {
    if (strict) throw e;
    // Base injoignable : dernière lecture réussie si on l'a, sinon défauts (jamais mis en cache).
    return cache?.rows ?? [];
  }
}

async function readFromDb({ strict }: { strict: boolean }): Promise<FleetOverride[]> {
  const sql = db();
  if (!sql) return [];
  try {
    const read = sql<FleetOverride[]>`SELECT * FROM rentmyrs_fleet`.catch((e: { code?: string }) => {
      if (e?.code === '42P01') return [] as FleetOverride[]; // table pas encore créée
      throw e;
    });
    const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000));
    return await Promise.race([read, timeout]);
  } catch (e) {
    console.error('fleet-store: read failed', e instanceof Error ? e.message : e);
    throw new Error('Base de données injoignable, réessaie dans un instant.');
  }
}

export async function writeOverride(o: FleetOverride) {
  const sql = db();
  if (!sql) throw new Error('POSTGRES_URL non configurée');
  await ensureTable();
  await sql`
    INSERT INTO rentmyrs_fleet (id, daily_rate, deposit, status, images, texts, videos, focuses, updated_at)
    VALUES (${o.id}, ${o.daily_rate}, ${o.deposit}, ${o.status}, ${o.images ? sql.json(o.images) : null}, ${o.texts ? sql.json(o.texts) : null}, ${o.videos ? sql.json(o.videos) : null}, ${o.focuses ? sql.json(o.focuses) : null}, now())
    ON CONFLICT (id) DO UPDATE SET
      daily_rate = EXCLUDED.daily_rate,
      deposit = EXCLUDED.deposit,
      status = EXCLUDED.status,
      images = EXCLUDED.images,
      texts = EXCLUDED.texts,
      videos = EXCLUDED.videos,
      focuses = EXCLUDED.focuses,
      updated_at = now()`;
}

export function applyOverrides(models: RsModel[], overrides: FleetOverride[]): RsModel[] {
  return models.map((m) => {
    const o = overrides.find((x) => x.id === m.id);
    if (!o) return { ...m, status: m.status ?? 'available' };
    return {
      ...m,
      dailyRate: o.daily_rate ?? m.dailyRate,
      deposit: o.deposit ?? m.deposit,
      status: isStatus(o.status) ? o.status : 'available',
      images: o.images && o.images.length ? o.images : m.images,
      // Une photo téléversée remplace le cadrage prévu pour la photo par défaut.
      focus: o.images && o.images.length ? undefined : m.focus,
      videos: o.videos ?? m.videos ?? [],
      focuses: o.focuses ?? m.focuses,
      tagline: { fr: o.texts?.tagline?.fr || m.tagline.fr, en: o.texts?.tagline?.en || m.tagline.en },
      intro: { fr: o.texts?.intro?.fr || m.intro.fr, en: o.texts?.intro?.en || m.intro.en },
    };
  });
}

/** Flotte RS telle qu'affichée sur le site (défauts + réglages admin). */
export async function getFleet(opts?: { strict?: boolean }): Promise<RsModel[]> {
  return applyOverrides(RS_MODELS, await readOverrides(opts));
}
