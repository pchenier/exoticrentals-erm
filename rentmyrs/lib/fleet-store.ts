import { db } from './db';
import { RS_MODELS, type RsModel, type VehicleStatus } from './fleet';

// Réglages modifiables dans /admin, par-dessus les valeurs par défaut de lib/fleet.ts.
export type FleetOverride = {
  id: RsModel['id'];
  daily_rate: number | null;
  deposit: number | null;
  status: VehicleStatus;
  images: string[] | null;
};

const STATUSES: VehicleStatus[] = ['available', 'unavailable', 'maintenance'];
export const isStatus = (v: unknown): v is VehicleStatus => STATUSES.includes(v as VehicleStatus);

let tableReady: Promise<unknown> | null = null;
function ensureTable() {
  const sql = db();
  if (!sql) return null;
  tableReady ??= sql`
    CREATE TABLE IF NOT EXISTS rentmyrs_fleet (
      id TEXT PRIMARY KEY,
      daily_rate INTEGER,
      deposit INTEGER,
      status TEXT NOT NULL DEFAULT 'available',
      images JSONB,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`.catch((e) => {
    tableReady = null;
    throw e;
  });
  return tableReady;
}

export async function readOverrides(): Promise<FleetOverride[]> {
  // Pendant le build Vercel, on n'attend pas la base : les pages se mettent à jour
  // toutes les 5 minutes (et tout de suite après un enregistrement dans /admin).
  if (process.env.NEXT_PHASE === 'phase-production-build') return [];
  const sql = db();
  if (!sql) return [];
  try {
    const read = (async () => {
      await ensureTable();
      return sql<FleetOverride[]>`SELECT id, daily_rate, deposit, status, images FROM rentmyrs_fleet`;
    })();
    // Une base lente ne doit jamais bloquer l'affichage du site.
    const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000));
    return await Promise.race([read, timeout]);
  } catch (e) {
    console.error('fleet-store: read failed', e instanceof Error ? e.message : e);
    return [];
  }
}

export async function writeOverride(o: FleetOverride) {
  const sql = db();
  if (!sql) throw new Error('POSTGRES_URL non configurée');
  await ensureTable();
  await sql`
    INSERT INTO rentmyrs_fleet (id, daily_rate, deposit, status, images, updated_at)
    VALUES (${o.id}, ${o.daily_rate}, ${o.deposit}, ${o.status}, ${o.images ? sql.json(o.images) : null}, now())
    ON CONFLICT (id) DO UPDATE SET
      daily_rate = EXCLUDED.daily_rate,
      deposit = EXCLUDED.deposit,
      status = EXCLUDED.status,
      images = EXCLUDED.images,
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
    };
  });
}

/** Flotte RS telle qu'affichée sur le site (défauts + réglages admin). */
export async function getFleet(): Promise<RsModel[]> {
  return applyOverrides(RS_MODELS, await readOverrides());
}
