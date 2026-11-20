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
        <div className="flex flex-wrap items-center gap-2">
          {(['fleet', 'bookings'] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={tab === k ? btnSolid : btn}>
              {k === 'fleet' ? 'Flotte' : 'Réservations'}
            </button>
          ))}
          <button onClick={logout} className={`${btn} text-mute`}>Déconnexion</button>
        </div>
      }
    >
      <PushPanel />
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
      .then(async (r) => (r.ok ? r.json() : Promise.reject(new Error((await r.json().catch(() => ({}))).error || `HTTP ${r.status}`))))
      .then((d) => {
        setError('');
        setModels(d.models);
        setDbOk(d.dbConfigured);
      })
      .catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  if (error)
    return (
      <div className="grid justify-items-start gap-3">
        <p className="text-sm text-rs">{error}</p>
        <button type="button" onClick={() => { setError(''); load(); }} className={btnSolid}>Réessayer</button>
      </div>
    );
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
  const [videos, setVideos] = useState<string[]>(model.videos ?? []);
  const [focuses, setFocuses] = useState<Record<string, string>>(model.focuses ?? {});
  const [focusDirty, setFocusDirty] = useState(0);
  const pos = (src: string) => (focuses[src] ?? '50% 50%').split(' ').map((v) => parseInt(v, 10)) as [number, number];
  const setFocus = (src: string, x: number, y: number) => {
    const c = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
    setFocuses((f) => ({ ...f, [src]: `${c(x)}% ${c(y)}%` }));
    setFocusDirty((n) => n + 1);
  };
  // Le cadrage est publié tout seul, une demi-seconde après le dernier réglage.
  useEffect(() => {
    if (!focusDirty || !canSave) return;
    const t = setTimeout(() => save(), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusDirty]);
  const [progress, setProgress] = useState<number | null>(null);
  const [library, setLibrary] = useState<string[]>([]);
  useEffect(() => {
    fetch(`/api/admin/upload?model=${model.id}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { urls: [] }))
      .then((d) => setLibrary(d.urls ?? []))
      .catch(() => {});
  }, [model.id]);
  const unused = library.filter((u) => !images.includes(u));
  const [texts, setTexts] = useState({ tagline: { ...model.tagline }, intro: { ...model.intro } });
  const setText = (k: 'tagline' | 'intro', l: 'fr' | 'en', v: string) => setTexts((c) => ({ ...c, [k]: { ...c[k], [l]: v } }));
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
    setBusy(false);
    // Les photos sont publiées tout de suite, sans devoir cliquer « Enregistrer ».
    if (added.length) await savePhotos([...images, ...added]);
  }

  async function uploadVideos(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMsg('');
    const added: string[] = [];
    const { upload: blobUpload } = await import('@vercel/blob/client');
    for (const f of Array.from(files)) {
      try {
        setProgress(0);
        const b = await blobUpload(`rentmyrs/videos/${model.id}/${f.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`, f, {
          access: 'public',
          handleUploadUrl: '/api/admin/upload-video',
          multipart: f.size > 20 * 1024 * 1024,
          onUploadProgress: (e) => setProgress(Math.round(e.percentage)),
        });
        added.push(b.url);
      } catch (e) {
        setMsg(`Échec de la vidéo : ${e instanceof Error ? e.message : 'erreur'} (MP4, MOV ou WebM, 500 Mo max)`);
      }
    }
    setProgress(null);
    setBusy(false);
    if (added.length) await saveVideos([...videos, ...added]);
  }

  async function saveVideos(next: string[]) {
    const prev = videos;
    setVideos(next);
    if (!canSave) return;
    if (!(await save(images, next))) setVideos(prev);
  }

  async function save(nextImages = images, nextVideos = videos) {
    setBusy(true);
    setMsg('');
    const r = await fetch('/api/admin/fleet', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: model.id, dailyRate: rate, deposit, status, images: nextImages, videos: nextVideos, focuses, texts }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    setMsg(r.ok ? 'Enregistré. Le site est à jour.' : d.error || `Erreur HTTP ${r.status}`);
    return r.ok;
  }

  async function savePhotos(next: string[]) {
    const prev = images;
    setImages(next);
    if (!canSave) return;
    if (!(await save(next))) setImages(prev);
  }

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    savePhotos(next);
  };

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

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {([['fr', 'Français'], ['en', 'English']] as const).map(([l, lang]) => (
          <div key={l} className="grid gap-3">
            <label className="label grid gap-1 text-mute">
              Accroche ({lang})
              <input value={texts.tagline[l]} onChange={(e) => setText('tagline', l, e.target.value)} maxLength={160} className={`${field} normal-case tracking-normal text-paper`} />
            </label>
            <label className="label grid gap-1 text-mute">
              Description ({lang})
              <textarea value={texts.intro[l]} onChange={(e) => setText('intro', l, e.target.value)} rows={6} maxLength={2000} className={`${field} resize-y normal-case leading-relaxed tracking-normal text-paper`} />
            </label>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p className="label text-mute">Photos (la première est la photo principale). Clique sur une photo ou utilise X / Y pour la recadrer.</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {images.map((src, i) => (
            <div key={src} className="group relative aspect-[4/3] overflow-hidden border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                title="Clique pour choisir le centre de la photo"
                style={{ objectPosition: focuses[src] ?? '50% 50%' }}
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setFocus(src, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
                }}
                className="h-full w-full cursor-crosshair object-cover"
              />
              <span aria-hidden className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-rs shadow" style={{ left: `${pos(src)[0]}%`, top: `${pos(src)[1]}%` }} />
              {i === 0 && <span className="label absolute left-1 top-1 bg-rs px-1.5 py-0.5 text-[9px]">Principale</span>}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/70 p-1 text-xs">
                <button type="button" onClick={() => move(i, -1)} className="px-2 hover:text-rs" aria-label="Avancer">←</button>
                <button type="button" onClick={() => savePhotos(images.filter((x) => x !== src))} className="px-2 hover:text-rs">Retirer</button>
                <button type="button" onClick={() => move(i, 1)} className="px-2 hover:text-rs" aria-label="Reculer">→</button>
              </div>
              <div className="absolute inset-x-0 bottom-7 grid gap-0.5 bg-black/70 px-2 py-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100">
                <label className="flex items-center gap-2 text-[10px] text-mute">X<input type="range" min={0} max={100} value={pos(src)[0]} onChange={(e) => setFocus(src, +e.target.value, pos(src)[1])} className="w-full accent-rs" /></label>
                <label className="flex items-center gap-2 text-[10px] text-mute">Y<input type="range" min={0} max={100} value={pos(src)[1]} onChange={(e) => setFocus(src, pos(src)[0], +e.target.value)} className="w-full accent-rs" /></label>
              </div>
            </div>
          ))}
          <label className="flex aspect-[4/3] cursor-pointer items-center justify-center border border-dashed border-line text-sm text-mute hover:border-paper hover:text-paper">
            {busy ? '…' : '+ Ajouter'}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden onChange={(e) => upload(e.target.files)} />
          </label>
        </div>
      </div>

      {unused.length > 0 && (
        <div className="mt-4">
          <p className="label text-mute">Photos déjà téléversées, pas affichées (clique pour la remettre)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {unused.map((src) => (
              <button key={src} type="button" onClick={() => savePhotos([...images, src])} className="relative h-16 w-24 overflow-hidden border border-line opacity-70 hover:border-paper hover:opacity-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-lg">+</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <p className="label text-mute">Vidéos (MP4, MOV ou WebM, 500 Mo max)</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {videos.map((src) => (
            <div key={src} className="relative aspect-video overflow-hidden border border-line bg-black">
              <video src={src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex justify-center bg-black/70 p-1 text-xs">
                <button type="button" onClick={() => saveVideos(videos.filter((x) => x !== src))} className="px-2 hover:text-rs">Retirer</button>
              </div>
            </div>
          ))}
          <label className="flex aspect-video cursor-pointer items-center justify-center border border-dashed border-line text-sm text-mute hover:border-paper hover:text-paper">
            {progress != null ? `${progress} %` : busy ? '…' : '+ Ajouter une vidéo'}
            <input type="file" accept="video/mp4,video/quicktime,video/webm" multiple hidden onChange={(e) => uploadVideos(e.target.files)} />
          </label>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button onClick={() => save()} disabled={busy || !canSave} className={btnSolid}>Enregistrer</button>
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
  estimate: string | null;
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
            {b.estimate && <span><span className="label text-mute">Estimé </span>{Number(b.estimate).toLocaleString('fr-CA')} $</span>}
          </div>
          {b.message && <p className="mt-3 border-t border-line pt-3 text-sm text-mute">{b.message}</p>}
          <p className="mt-2 text-xs text-mute/60">Reçue le {new Date(b.created_at).toLocaleString('fr-CA')}</p>
        </article>
      ))}
    </div>
  );
}

// ── Notifications push ─────────────────────────────────────────────────

function urlB64ToUint8Array(b64: string) {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function PushPanel() {
  const [info, setInfo] = useState<{ publicKey: string | null; devices: number; dbConfigured: boolean } | null>(null);
  const [support, setSupport] = useState<'ok' | 'ios-browser' | 'none'>('ok');
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/push', { cache: 'no-store' });
    if (r.ok) setInfo(await r.json());
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration('/');
      const sub = await reg?.pushManager?.getSubscription();
      setSubscribed(!!sub && Notification.permission === 'granted');
    }
  }, []);

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone;
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      setSupport(ios && !standalone ? 'ios-browser' : 'none');
    }
    load();
  }, [load]);

  async function enable() {
    if (!info?.publicKey) return;
    setBusy(true);
    setMsg('');
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') throw new Error('Notifications refusées dans les réglages du téléphone.');
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(info.publicKey) }));
      const label = /iPhone/.test(navigator.userAgent) ? 'iPhone' : /Android/.test(navigator.userAgent) ? 'Android' : 'Ordinateur';
      const r = await fetch('/api/admin/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), label }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `HTTP ${r.status}`);
      setMsg('Activé sur cet appareil.');
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    const reg = await navigator.serviceWorker.getRegistration('/');
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await fetch('/api/admin/push', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) });
      await sub.unsubscribe();
    }
    setMsg('Désactivé sur cet appareil.');
    await load();
    setBusy(false);
  }

  async function test() {
    setBusy(true);
    const r = await fetch('/api/admin/push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ test: true }) });
    const d = await r.json().catch(() => ({}));
    setMsg(d.sent ? `Test envoyé à ${d.sent} appareil${d.sent > 1 ? 's' : ''}.` : 'Aucun appareil n’a reçu le test.');
    setBusy(false);
  }

  if (!info) return null;

  return (
    <section className="mb-8 flex flex-col gap-3 border border-line bg-panel p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="label">Notifications sur ton téléphone</p>
        <p className="mt-1 text-sm text-mute">
          {!info.dbConfigured
            ? 'Ajoute POSTGRES_URL dans Vercel pour activer les notifications.'
            : !info.publicKey
              ? 'Notifications indisponibles pour le moment (voir les logs Vercel).'
              : support === 'ios-browser'
                ? 'Sur iPhone : touche Partager, puis « Sur l’écran d’accueil ». Ouvre l’admin depuis l’icône et reviens ici.'
                : support === 'none'
                  ? 'Ce navigateur ne gère pas les notifications.'
                  : subscribed
                    ? `Actif sur cet appareil · ${info.devices} appareil${info.devices > 1 ? 's' : ''} inscrit${info.devices > 1 ? 's' : ''}.`
                    : `Une alerte à chaque nouvelle demande · ${info.devices} appareil${info.devices > 1 ? 's' : ''} inscrit${info.devices > 1 ? 's' : ''}.`}
        </p>
        {msg && <p className="mt-1 text-sm text-paper">{msg}</p>}
      </div>
      {info.publicKey && info.dbConfigured && support === 'ok' && (
        <div className="flex gap-2">
          {subscribed ? (
            <>
              <button onClick={test} disabled={busy} className={btn}>Tester</button>
              <button onClick={disable} disabled={busy} className={`${btn} text-mute`}>Désactiver</button>
            </>
          ) : (
            <button onClick={enable} disabled={busy} className={btnSolid}>Activer</button>
          )}
        </div>
      )}
    </section>
  );
}
