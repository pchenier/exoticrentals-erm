'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/site';

// Calendrier de réservation : un clic pour le départ, un clic pour le retour.
// Dates en « AAAA-MM-JJ » (heure locale), jours passés désactivés.
export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

function Month({ year, month, locale, today, start, end, hover, onPick, onHover }: {
  year: number; month: number; locale: Locale; today: string; start: string; end: string; hover: string;
  onPick: (s: string) => void; onHover: (s: string) => void;
}) {
  const lang = locale === 'fr' ? 'fr-CA' : 'en-CA';
  const title = new Date(year, month, 1).toLocaleDateString(lang, { month: 'long', year: 'numeric' });
  const days = locale === 'fr' ? ['L', 'M', 'M', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // semaine qui commence lundi
  const count = new Date(year, month + 1, 0).getDate();
  const rangeEnd = end || (start && hover > start ? hover : '');

  return (
    <div className="min-w-0">
      <p className="label mb-3 text-center text-paper first-letter:uppercase">{title}</p>
      <div className="grid grid-cols-7 text-center">
        {days.map((x, i) => (
          <span key={i} className="label pb-2 text-[10px] text-mute">{x}</span>
        ))}
        {Array.from({ length: offset }, (_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: count }, (_, i) => {
          const s = iso(new Date(year, month, i + 1));
          const past = s < today;
          const isStart = s === start;
          const isEnd = s === rangeEnd;
          const inRange = start && rangeEnd && s > start && s < rangeEnd;
          return (
            <button
              key={s}
              type="button"
              disabled={past}
              onClick={() => onPick(s)}
              onMouseEnter={() => onHover(s)}
              aria-label={parse(s).toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long' })}
              aria-pressed={isStart || isEnd}
              className={`relative h-10 text-sm font-light transition sm:h-9 ${
                isStart || isEnd
                  ? 'bg-rs font-semibold text-paper'
                  : inRange
                    ? 'bg-rs/20 text-paper'
                    : past
                      ? 'cursor-not-allowed text-paper/20'
                      : 'text-paper hover:bg-paper/10'
              } ${s === today && !isStart && !isEnd ? 'underline decoration-rs underline-offset-4' : ''}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRangeCalendar({ locale, start, end, onChange }: {
  locale: Locale; start: string; end: string; onChange: (start: string, end: string) => void;
}) {
  const now = new Date();
  const today = iso(now);
  const [view, setView] = useState(() => {
    const b = start ? parse(start) : now;
    return { y: b.getFullYear(), m: b.getMonth() };
  });
  const [hover, setHover] = useState('');
  const next = view.m === 11 ? { y: view.y + 1, m: 0 } : { y: view.y, m: view.m + 1 };
  const atFirst = view.y === now.getFullYear() && view.m === now.getMonth();
  const move = (k: number) => setView((v) => {
    const d = new Date(v.y, v.m + k, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const pick = (s: string) => {
    if (!start || end || s < start) onChange(s, '');
    else onChange(start, s); // même jour = location d'une journée
  };

  const lang = locale === 'fr' ? 'fr-CA' : 'en-CA';
  const show = (s: string) => (s ? parse(s).toLocaleDateString(lang, { weekday: 'short', day: 'numeric', month: 'short' }) : '—');
  const fr = locale === 'fr';

  return (
    <div>
      <div className="grid grid-cols-2 gap-px border border-line bg-line">
        <div className={`bg-panel px-4 py-3 ${start && !end ? '' : !start ? 'ring-1 ring-inset ring-rs' : ''}`}>
          <p className="label text-[10px] text-mute">{fr ? 'Départ' : 'Pick-up'}</p>
          <p className="mt-1 text-base font-light first-letter:uppercase">{show(start)}</p>
        </div>
        <div className={`bg-panel px-4 py-3 ${start && !end ? 'ring-1 ring-inset ring-rs' : ''}`}>
          <p className="label text-[10px] text-mute">{fr ? 'Retour' : 'Return'}</p>
          <p className="mt-1 text-base font-light first-letter:uppercase">{show(end)}</p>
        </div>
      </div>

      <div className="relative mt-5" onMouseLeave={() => setHover('')}>
        <button type="button" onClick={() => move(-1)} disabled={atFirst} aria-label={fr ? 'Mois précédent' : 'Previous month'} className="absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center text-xl text-paper transition hover:text-rs disabled:opacity-20">‹</button>
        <button type="button" onClick={() => move(1)} aria-label={fr ? 'Mois suivant' : 'Next month'} className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center text-xl text-paper transition hover:text-rs">›</button>
        <div className="grid gap-8 sm:grid-cols-2">
          <Month year={view.y} month={view.m} locale={locale} today={today} start={start} end={end} hover={hover} onPick={pick} onHover={setHover} />
          <div className="hidden sm:block">
            <Month year={next.y} month={next.m} locale={locale} today={today} start={start} end={end} hover={hover} onPick={pick} onHover={setHover} />
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-mute">
        {!start ? (fr ? 'Choisis ta date de départ.' : 'Pick your start date.') : !end ? (fr ? 'Choisis ta date de retour.' : 'Pick your return date.') : (
          <button type="button" onClick={() => onChange('', '')} className="underline underline-offset-4 hover:text-paper">{fr ? 'Effacer les dates' : 'Clear dates'}</button>
        )}
      </p>
    </div>
  );
}
