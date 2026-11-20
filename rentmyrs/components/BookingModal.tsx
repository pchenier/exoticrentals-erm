'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Locale } from '@/lib/site';
import type { RsModel } from '@/lib/fleet';
import { t } from '@/lib/dict';
import BookingForm from './BookingForm';

// Formulaire de réservation en fenêtre (popup). S'ouvre sur tout lien vers « #reserver »
// (boutons Réserver, Faire une demande…) et quand on arrive sur la page avec #reserver.
export default function BookingModal({ locale, models, defaultModel }: { locale: Locale; models: RsModel[]; defaultModel?: string }) {
  const d = t(locale).booking;
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);

  const show = useCallback(() => {
    setKey((k) => k + 1); // formulaire neuf à chaque ouverture
    setOpen(true);
  }, []);

  useEffect(() => {
    const isBookingLink = (a: HTMLAnchorElement) => {
      const url = new URL(a.href, location.href);
      return url.hash === '#reserver' && url.pathname === location.pathname;
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || !isBookingLink(a)) return;
      e.preventDefault();
      show();
    };
    const fromHash = () => {
      if (location.hash === '#reserver') {
        history.replaceState(null, '', location.pathname + location.search);
        show();
      }
    };
    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', fromHash);
    fromHash();
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', fromHash);
    };
  }, [show]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto border border-line bg-panel px-5 pb-8 pt-6 sm:px-8">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={locale === 'fr' ? 'Fermer' : 'Close'}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-2xl font-light text-mute transition hover:text-paper"
        >
          ×
        </button>
        <h2 id="booking-title" className="pr-10 text-2xl font-bold uppercase leading-none tracking-tight sm:text-3xl">{d.title}</h2>
        <div className="rule mt-5" />
        <p className="mt-4 text-sm font-light text-mute">{d.sub}</p>
        <div className="mt-8">
          <BookingForm key={key} locale={locale} models={models} defaultModel={defaultModel} />
        </div>
      </div>
    </div>
  );
}
