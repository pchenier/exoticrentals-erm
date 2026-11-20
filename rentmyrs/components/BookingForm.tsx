'use client';

import { useState } from 'react';
import { SITE, waUrl, type Locale } from '@/lib/site';
import type { RsModel } from '@/lib/fleet';
import { t } from '@/lib/dict';

const field =
  'w-full border-0 border-b border-line bg-transparent px-0 py-3 text-base font-light normal-case tracking-normal text-paper [font-stretch:100%] outline-none transition focus:border-paper';

export default function BookingForm({ locale, models, defaultModel }: { locale: Locale; models: RsModel[]; defaultModel?: string }) {
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
      <div role="status" className="border-l-2 border-rs py-6 pl-6">
        <p className="text-xl font-light">{d.ok}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      {/* Pot de miel anti-robots : invisible pour les humains. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="label grid gap-1 text-mute">
        {d.name}
        <input name="name" required maxLength={100} autoComplete="name" className={field} />
      </label>
      <label className="label grid gap-1 text-mute">
        {d.phone}
        <input name="phone" type="tel" required maxLength={30} autoComplete="tel" className={field} />
      </label>
      <label className="label grid gap-1 text-mute">
        {d.email}
        <input name="email" type="email" maxLength={150} autoComplete="email" className={field} />
      </label>
      <label className="label grid gap-1 text-mute">
        {d.model}
        <select name="vehicle" defaultValue={defaultModel ?? ''} className={`${field} bg-panel`}>
          <option value="">{d.any}</option>
          {models.map((m) => {
            const off = !!m.status && m.status !== 'available';
            return (
              <option key={m.id} value={m.name} disabled={off}>
                {m.name}
                {off ? ` (${t(locale).fleet.notAvail})` : ''}
              </option>
            );
          })}
          <option value="Lamborghini">Lamborghini</option>
        </select>
      </label>
      <label className="label grid gap-1 text-mute">
        {d.start}
        <input name="startDate" type="date" required min={today} value={start} onChange={(e) => setStart(e.target.value)} className={field} />
      </label>
      <label className="label grid gap-1 text-mute">
        {d.end}
        <input name="endDate" type="date" required min={start || today} className={field} />
      </label>
      <label className="label grid gap-1 text-mute sm:col-span-2">
        {d.message}
        <textarea name="message" rows={3} maxLength={1000} placeholder={d.messagePh} className={field} />
      </label>
      <div className="mt-4 flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="label inline-flex items-center gap-4 bg-paper px-6 py-4 text-ink transition hover:bg-rs hover:text-paper disabled:opacity-60"
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
        <p role="alert" className="text-sm text-rs sm:col-span-2">
          {d.err}
        </p>
      )}
    </form>
  );
}
