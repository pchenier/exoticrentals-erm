'use client';

import { useState } from 'react';
import { SITE, waUrl, type Locale } from '@/lib/site';
import { RS_MODELS } from '@/lib/fleet';
import { t } from '@/lib/dict';

const field =
  'w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm outline-none transition focus:border-rs';

export default function BookingForm({ locale, defaultModel }: { locale: Locale; defaultModel?: string }) {
  const d = t(locale).booking;
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });
      setState(res.ok ? 'ok' : 'err');
    } catch {
      setState('err');
    }
  }

  if (state === 'ok') {
    return (
      <div role="status" className="rounded-2xl border border-rs/50 bg-panel p-8 text-center">
        <p className="text-lg font-semibold">{d.ok}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-line bg-panel p-5 sm:grid-cols-2 sm:p-7">
      {/* Pot de miel anti-robots : invisible pour les humains. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        {d.name}
        <input name="name" required maxLength={100} autoComplete="name" className={field} />
      </label>
      <label className="grid gap-1.5 text-sm">
        {d.phone}
        <input name="phone" type="tel" required maxLength={30} autoComplete="tel" className={field} />
      </label>
      <label className="grid gap-1.5 text-sm">
        {d.email}
        <input name="email" type="email" maxLength={150} autoComplete="email" className={field} />
      </label>
      <label className="grid gap-1.5 text-sm">
        {d.model}
        <select name="vehicle" defaultValue={defaultModel ?? ''} className={field}>
          <option value="">{d.any}</option>
          {RS_MODELS.map((m) => (
            <option key={m.id} value={m.name}>
              {m.name}
            </option>
          ))}
          <option value="Lamborghini">Lamborghini</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">
        {d.start}
        <input name="startDate" type="date" required min={today} value={start} onChange={(e) => setStart(e.target.value)} className={field} />
      </label>
      <label className="grid gap-1.5 text-sm">
        {d.end}
        <input name="endDate" type="date" required min={start || today} className={field} />
      </label>
      <label className="grid gap-1.5 text-sm sm:col-span-2">
        {d.message}
        <textarea name="message" rows={3} maxLength={1000} placeholder={d.messagePh} className={field} />
      </label>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="rounded-full bg-rs px-6 py-3 text-sm font-semibold text-white transition hover:bg-rs/90 disabled:opacity-60"
        >
          {state === 'sending' ? d.sending : d.submit}
        </button>
        <p className="text-xs text-mute">
          {d.orText} :{' '}
          <a href={`sms:${SITE.phone}`} className="text-paper underline underline-offset-4">SMS</a> ·{' '}
          <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="text-paper underline underline-offset-4">WhatsApp</a>
        </p>
      </div>
      {state === 'err' && (
        <p role="alert" className="text-sm text-rs sm:col-span-2">
          {d.err}
        </p>
      )}
    </form>
  );
}
