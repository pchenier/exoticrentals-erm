'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { SITE, waUrl, type Locale } from '@/lib/site';
import type { RsModel } from '@/lib/fleet';
import { t } from '@/lib/dict';
import { RsMark } from './ui';

const field =
  'w-full border-0 border-b border-line bg-transparent px-0 py-3 text-base font-light normal-case tracking-normal text-paper [font-stretch:100%] outline-none transition focus:border-paper';

const DAY = 24 * 60 * 60 * 1000;
const fmt = (n: number, locale: Locale) => n.toLocaleString(locale === 'fr' ? 'fr-CA' : 'en-CA');

export default function BookingForm({ locale, models, defaultModel }: { locale: Locale; models: RsModel[]; defaultModel?: string }) {
  const d = t(locale).booking;
  const f = t(locale).fleet;
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const today = new Date().toISOString().slice(0, 10);
  const [vehicle, setVehicle] = useState(defaultModel ?? '');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const chosen = models.find((m) => m.name === vehicle);
  const days = useMemo(() => {
    if (!start || !end) return 0;
    const n = Math.round((Date.parse(end) - Date.parse(start)) / DAY);
    return n > 0 ? n : n === 0 ? 1 : 0;
  }, [start, end]);
  const estimate = chosen?.dailyRate && days ? chosen.dailyRate * days : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, vehicle, estimate: estimate ?? '', locale }),
      });
      setState(res.ok ? 'ok' : 'err');
    } catch {
      setState('err');
    }
  }

  if (state === 'ok') {
    return (
      <div role="status" className="border-l-2 border-rs py-6 pl-6">
        <p className="text-xl font-light">{d.ok}</p>
      </div>
    );
  }

  const options: { key: string; label: string; sub: string; img?: string; off: boolean; wide?: boolean }[] = [
    ...models.map((m) => {
      const off = !!m.status && m.status !== 'available';
      return {
        key: m.name,
        label: m.short,
        sub: off ? f.notAvail : m.dailyRate != null ? `${fmt(m.dailyRate, locale)} $${f.perDay}` : f.onRequest,
        img: m.images[0],
        off,
      };
    }),
    { key: 'Lamborghini', label: 'Lambo', sub: 'Huracán · Urus', img: '/cars/huracan-evo.jpg', off: false, wide: models.length % 2 === 0 },
  ];

  return (
    <form onSubmit={onSubmit} className="grid gap-10">
      {/* Pot de miel anti-robots : invisible pour les humains. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* 1. Modèle */}
      <fieldset>
        <legend className="label mb-4 text-mute">01 · {d.model}</legend>
        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-6">
          {options.map((o) => {
            const on = vehicle === o.key;
            return (
              <button
                key={o.key}
                type="button"
                disabled={o.off}
                onClick={() => setVehicle(on ? '' : o.key)}
                aria-pressed={on}
                className={`group relative flex ${o.wide ? 'col-span-2 aspect-[8/3] sm:col-span-1' : 'aspect-[4/3]'} flex-col justify-end overflow-hidden bg-ink p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-35 sm:aspect-[3/4] ${on ? 'outline outline-2 -outline-offset-2 outline-rs' : ''}`}
              >
                {o.img && (
                  <Image src={o.img} alt="" fill sizes="(min-width: 640px) 15vw, 50vw" className={`object-cover transition duration-500 ${on ? 'opacity-70' : 'opacity-40 group-hover:opacity-60'}`} />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <span className="wide relative text-2xl font-bold tracking-tight"><RsMark name={o.label} /></span>
                <span className="label relative mt-1 text-[10px] text-paper/70">{o.sub}</span>
                {on && <span className="absolute right-2 top-2 bg-rs px-1.5 text-xs font-bold">✓</span>}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-mute">{vehicle ? '' : d.any}</p>
      </fieldset>

      {/* 2. Dates */}
      <fieldset className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <legend className="label mb-4 text-mute">02 · {locale === 'fr' ? 'Dates' : 'Dates'}</legend>
        <label className="label grid gap-1 text-mute">
          {d.start}
          <input name="startDate" type="date" required min={today} value={start} onChange={(e) => setStart(e.target.value)} className={field} />
        </label>
        <label className="label grid gap-1 text-mute">
          {d.end}
          <input name="endDate" type="date" required min={start || today} value={end} onChange={(e) => setEnd(e.target.value)} className={field} />
        </label>
      </fieldset>

      {/* Récapitulatif */}
      {(chosen || days > 0) && (
        <div className="grid grid-cols-3 gap-3 border-y border-line py-5 sm:gap-4">
          <Summary label={locale === 'fr' ? 'Durée' : 'Length'} value={days ? `${days} ${locale === 'fr' ? (days > 1 ? 'jours' : 'jour') : days > 1 ? 'days' : 'day'}` : '—'} />
          <Summary label={locale === 'fr' ? 'Total estimé' : 'Estimated total'} value={estimate ? `${fmt(estimate, locale)} $` : '—'} accent />
          <Summary label={locale === 'fr' ? 'Dépôt' : 'Deposit'} value={chosen ? `${fmt(chosen.deposit, locale)} $` : '—'} />
          <p className="col-span-3 text-xs text-mute">
            {locale === 'fr'
              ? 'Avant taxes. Aucun paiement en ligne : on confirme le prix final avec toi.'
              : 'Before taxes. No online payment: we confirm the final price with you.'}
          </p>
        </div>
      )}

      {/* 3. Coordonnées */}
      <fieldset className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <legend className="label mb-4 text-mute">03 · {locale === 'fr' ? 'Tes coordonnées' : 'Your details'}</legend>
        <label className="label grid gap-1 text-mute">
          {d.name}
          <input name="name" required maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="label grid gap-1 text-mute">
          {d.phone}
          <input name="phone" type="tel" required maxLength={30} autoComplete="tel" className={field} />
        </label>
        <label className="label grid gap-1 text-mute sm:col-span-2">
          {d.email}
          <input name="email" type="email" maxLength={150} autoComplete="email" className={field} />
        </label>
        <label className="label grid gap-1 text-mute sm:col-span-2">
          {d.message}
          <textarea name="message" rows={2} maxLength={1000} placeholder={d.messagePh} className={field} />
        </label>
      </fieldset>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="cta cta-idle label inline-flex items-center justify-center gap-4 bg-rs px-10 py-4 font-bold text-paper hover:bg-paper hover:text-ink disabled:opacity-60"
        >
          {state === 'sending' ? d.sending : d.submit} <span aria-hidden>→</span>
        </button>
        <p className="text-xs text-mute">
          {d.orText} :{' '}
          <a href={`sms:${SITE.phone}`} className="text-paper underline underline-offset-4">SMS</a> ·{' '}
          <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="text-paper underline underline-offset-4">WhatsApp</a>
        </p>
      </div>
      {state === 'err' && (
        <p role="alert" className="text-sm text-rs">
          {d.err}
        </p>
      )}
    </form>
  );
}

function Summary({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className={`wide text-lg font-medium sm:text-2xl ${accent ? 'text-rs' : ''}`}>{value}</p>
      <p className="label mt-1 break-words text-[10px] text-mute sm:text-xs">{label}</p>
    </div>
  );
}
