'use client';

import { useCallback, useEffect, useState } from 'react';
import type { RsModel, VehicleStatus } from '@/lib/fleet';

// Admin RentMyRS : connexion par mot de passe (ADMIN_PASSWORD côté serveur, cookie httpOnly),
// réglages de la flotte RS et liste des demandes de réservation.

const field = 'w-full border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-paper';
const btn = 'label border border-line px-4 py-2 transition hover:border-paper disabled:opacity-40';
const btnSolid = 'label bg-paper px-4 py-2 text-ink transition hover:bg-rs hover:text-paper disabled:opacity-40';

const STATUS: { value: VehicleStatus; label: string; on: string }[] = [
  { value: 'available', label: 'Disponible', on: 'border-green-500/60 bg-green-500/15 text-green-300' },
  { value: 'unavailable', label: 'Non dispo', on: 'border-red-500/60 bg-red-500/15 text-red-300' },
  { value: 'maintenance', label: 'Entretien', on: 'border-amber-500/60 bg-amber-500/15 text-amber-300' },
];

export default function AdminPage() {
  const [state, setState] = useState<'checking' | 'login' | 'in'>('checking');
  const [configured, setConfigured] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'fleet' | 'bookings'>('fleet');

  useEffect(() => {
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setConfigured(!!d.configured);
        setState(d.authed ? 'in' : 'login');
      })
      .catch(() => setState('login'));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const r = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (r.ok) {
      setPassword('');
      setState('in');
    } else {
      setError(r.status === 503 ? 'ADMIN_PASSWORD n’est pas configuré dans Vercel.' : 'Mot de passe incorrect.');
    }
  }

  async function logout() {
    await fetch('/api/admin/session', { method: 'DELETE' }).catch(() => {});
    setState('login');
  }

  if (state === 'checking') return <Shell><p className="label text-mute">Chargement…</p></Shell>;

  if (state === 'login') {
    return (
      <Shell>
        <form onSubmit={login} className="mx-auto mt-24 grid max-w-sm gap-4">
          <h1 className="text-3xl font-bold uppercase tracking-tight">Admin</h1>
          {!configured && (
            <p className="border-l-2 border-rs pl-3 text-sm text-mute">
              Ajoute la variable <code>ADMIN_PASSWORD</code> dans Vercel (projet rentmyrs), puis redéploie.
            </p>
          )}
          <input type="password" autoComplete="current-password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
          <button className={btnSolid} disabled={!password}>Se connecter</button>
          {error && <p className="text-sm text-rs">{error}</p>}
        </form>
      </Shell>
    );
  }

  return (
    <Shell
      right={
        <div className="flex items-center gap-2">
          {(['fleet', 'bookings'] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={tab === k ? btnSolid : btn}>
              {k === 'fleet' ? 'Flotte' : 'Réservations'}
            </button>
          ))}
          <button onClick={logout} className={`${btn} text-mute`}>Déconnexion</button>
        </div>
      }
    >
      {tab === 'fleet' ? <FleetTab /> : <BookingsTab />}
    </Shell>
  );
}

function Shell({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <a href="/" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]">
            RentMy<span className="slant px-2 py-0.5 text-xs font-bold italic"><span>RS</span></span>
            <span className="label ml-2 text-mute">Admin</span>
          </a>
          {right}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

// ── Flotte ──────────────────────────────────────────────────────────────

function FleetTab() {
  const [models, setModels] = useState<RsModel[] | null>(null);
  const [dbOk, setDbOk] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    fetch('/api/admin/fleet', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => {
        setModels(d.models);
        setDbOk(d.dbConfigured);
      })
      .catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  if (error) return <p className="text-sm text-rs">{error}</p>;
  if (!models) return <p className="label text-mute">Chargement…</p>;

  return (
    <div className="grid gap-6">
      {!dbOk && (
        <p className="border-l-2 border-rs pl-3 text-sm text-mute">
          La base de données n’est pas branchée : ajoute <code>POSTGRES_URL</code> dans Vercel pour pouvoir enregistrer.
        </p>
      )}
      {models.map((m) => <ModelEditor key={m.id} model={m} canSave={dbOk} />)}
    </div>
  );
}

function ModelEditor({ model, canSave }: { model: RsModel; canSave: boolean }) {
  const [rate, setRate] = useState(model.dailyRate?.toString() ?? '');
  const [deposit, setDeposit] = useState(model.deposit.toString());
  const [status, setStatus] = useState<VehicleStatus>(model.status ?? 'available');
  const [images, setImages] = useState<string[]>(model.images);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMsg('');
    const added: string[] = [];
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', f);
      fd.append('model', model.id);
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.url) added.push(d.url);
      else setMsg(d.error || `Échec du téléversement (HTTP ${r.status})`);
    }
    setImages((cur) => [...cur, ...added]);
    setBusy(false);
    if (added.length) setMsg('Photo ajoutée. Clique « Enregistrer » pour la publier.');
  }

  async function save() {
    setBusy(true);
    setMsg('');
    const r = await fetch('/api/admin/fleet', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: model.id, dailyRate: rate, deposit, status, images }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    setMsg(r.ok ? 'Enregistré. Le site est à jour.' : d.error || `Erreur HTTP ${r.status}`);
  }

  const move = (i: number, dir: -1 | 1) =>
    setImages((cur) => {
      const next = [...cur];
      const j = i + dir;
      if (j < 0 || j >= next.length) return cur;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <section className="border border-line bg-panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold tracking-tight">{model.name}</h2>
        <div className="flex">
          {STATUS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatus(s.value)}
              className={`label -ml-px border px-3 py-1.5 first:ml-0 ${status === s.value ? s.on : 'border-line text-mute hover:text-paper'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="label grid gap-1 text-mute">
          Prix par jour ($)
          <input inputMode="numeric" value={rate} onChange={(e) => setRate(e.target.value.replace(/\D/g, ''))} placeholder="Sur demande" className={`${field} normal-case tracking-normal text-paper`} />
        </label>
        <label className="label grid gap-1 text-mute">
          Dépôt ($)
          <input inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value.replace(/\D/g, ''))} className={`${field} normal-case tracking-normal text-paper`} />
        </label>
      </div>

      <div className="mt-5">
        <p className="label text-mute">Photos (la première est la photo principale)</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {images.map((src, i) => (
            <div key={src} className="group relative aspect-[4/3] overflow-hidden border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === 0 && <span className="label absolute left-1 top-1 bg-rs px-1.5 py-0.5 text-[9px]">Principale</span>}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/70 p-1 text-xs">
                <button type="button" onClick={() => move(i, -1)} className="px-2 hover:text-rs" aria-label="Avancer">←</button>
                <button type="button" onClick={() => setImages((c) => c.filter((x) => x !== src))} className="px-2 hover:text-rs">Retirer</button>
                <button type="button" onClick={() => move(i, 1)} className="px-2 hover:text-rs" aria-label="Reculer">→</button>
              </div>
            </div>
          ))}
          <label className="flex aspect-[4/3] cursor-pointer items-center justify-center border border-dashed border-line text-sm text-mute hover:border-paper hover:text-paper">
            {busy ? '…' : '+ Ajouter'}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden onChange={(e) => upload(e.target.files)} />
          </label>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button onClick={save} disabled={busy || !canSave} className={btnSolid}>Enregistrer</button>
        {msg && <p className="text-sm text-mute">{msg}</p>}
      </div>
    </section>
  );
}

// ── Réservations ────────────────────────────────────────────────────────

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  vehicle: string | null;
  start_date: string;
  end_date: string;
  message: string | null;
  created_at: string;
};

const day = (v: string) => (v ? String(v).slice(0, 10) : '—');

function BookingsTab() {
  const [rows, setRows] = useState<Booking[] | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setError('');
    fetch('/api/admin/bookings', { cache: 'no-store' })
      .then(async (r) => (r.ok ? r.json() : Promise.reject(new Error((await r.json().catch(() => ({}))).error || `HTTP ${r.status}`))))
      .then(setRows)
      .catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  async function del(id: string) {
    if (!confirm('Supprimer cette demande ?')) return;
    await fetch(`/api/admin/bookings?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    load();
  }

  if (error) return <p className="text-sm text-rs">{error}</p>;
  if (!rows) return <p className="label text-mute">Chargement…</p>;

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <p className="label text-mute">{rows.length} demande{rows.length > 1 ? 's' : ''}</p>
        <button onClick={load} className={btn}>Rafraîchir</button>
      </div>
      {rows.length === 0 && <p className="border border-line p-8 text-center text-sm text-mute">Aucune demande pour le moment.</p>}
      {rows.map((b) => (
        <article key={b.id} className="border border-line bg-panel p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{b.name}</p>
              <p className="text-sm text-mute">
                <a href={`tel:${b.phone}`} className="hover:text-paper">{b.phone}</a>
                {b.email && <> · <a href={`mailto:${b.email}`} className="hover:text-paper">{b.email}</a></>}
              </p>
            </div>
            <button onClick={() => del(b.id)} className="label text-mute hover:text-rs">Supprimer</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span><span className="label text-mute">Véhicule </span>{(b.vehicle || '—').replace('[RentMyRS] ', '')}</span>
            <span><span className="label text-mute">Début </span>{day(b.start_date)}</span>
            <span><span className="label text-mute">Retour </span>{day(b.end_date)}</span>
          </div>
          {b.message && <p className="mt-3 border-t border-line pt-3 text-sm text-mute">{b.message}</p>}
          <p className="mt-2 text-xs text-mute/60">Reçue le {new Date(b.created_at).toLocaleString('fr-CA')}</p>
        </article>
      ))}
    </div>
  );
}
