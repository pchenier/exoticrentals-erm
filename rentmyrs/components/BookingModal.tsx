'use client';

import { useCallback, useEffect, useState } from 'react';
import { SITE, waUrl, type Locale } from '@/lib/site';
import type { RsModel } from '@/lib/fleet';
import { t } from '@/lib/dict';
import BookingForm from './BookingForm';

// Formulaire de réservation en fenêtre (popup). S'ouvre sur tout lien vers « #reserver »
// (boutons Réserver, Faire une demande…) et quand on arrive sur la page avec #reserver.
export default function BookingModal({ locale, models, defaultModel }: { locale: Locale; models: RsModel[]; defaultModel?: string }) {
  const d = t(locale).booking;
  const fr = locale === 'fr';
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);
  const [step, setStep] = useState<'choice' | 'form'>('choice');

  const show = useCallback(() => {
    setKey((k) => k + 1); // formulaire neuf à chaque ouverture
    setStep('choice');
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
      <div className={`relative max-h-[92svh] w-full ${step === 'choice' ? 'max-w-xl' : 'max-w-3xl'} overflow-y-auto border border-line bg-panel px-5 pb-8 pt-6 sm:px-8`}>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={locale === 'fr' ? 'Fermer' : 'Close'}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-2xl font-light text-mute transition hover:text-paper"
        >
          ×
        </button>
        {step === 'choice' ? (
          <>
            <h2 id="booking-title" className="pr-10 text-2xl font-bold uppercase leading-none tracking-tight sm:text-3xl">
              {fr ? 'Comment veux-tu réserver ?' : 'How would you like to book?'}
            </h2>
            <div className="rule mt-5" />
            <p className="mt-4 text-sm font-light text-mute">
              {fr ? 'Choisis ce qui est le plus simple pour toi. On te répond vite.' : 'Pick what works best for you. We answer fast.'}
            </p>
            <div className="mt-8 grid gap-3">
              <div className="flex w-full items-center gap-4 border border-line bg-ink pr-4 transition hover:border-paper">
                <a href={`tel:${SITE.phone}`} className="flex flex-1 items-center gap-4 py-4 pl-5">
                <Icon d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
                <span className="flex-1">
                  <span className="block text-lg font-medium">{fr ? 'Appeler ou texter' : 'Call or text'}</span>
                  <span className="block text-sm font-light text-mute">{SITE.phoneDisplay}</span>
                </span>
                </a>
                <a href={`sms:${SITE.phone}`} className="label border border-line px-3 py-2 text-[10px] hover:border-paper">SMS</a>
              </div>
              <a href={waUrl(defaultModel ? (fr ? `Bonjour, je voudrais réserver la ${defaultModel}` : `Hi, I'd like to book the ${defaultModel}`) : undefined)} target="_blank" rel="noopener noreferrer" className={choice}>
                <Icon fill="#25D366" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.2-.7-2.7-1.1-4.4-3.9-4.5-4-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2z" />
                <span className="flex-1">
                  <span className="block text-lg font-medium">WhatsApp</span>
                  <span className="block text-sm font-light text-mute">{fr ? 'Écris-nous, réponse rapide' : 'Message us, quick reply'}</span>
                </span>
                <span aria-hidden className="text-xl text-mute">↗</span>
              </a>
              <button type="button" onClick={() => setStep('form')} className={`${choice} border-rs bg-rs/10 text-left`}>
                <Icon d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zm-2 8h14v10H5zm2 2v2h2v-2zm4 0v2h2v-2zm4 0v2h2v-2z" />
                <span className="flex-1">
                  <span className="block text-lg font-medium">{fr ? 'Formulaire de réservation' : 'Booking form'}</span>
                  <span className="block text-sm font-light text-mute">{fr ? 'Choisis ton auto et tes dates, on te confirme par texto' : 'Pick your car and dates, we confirm by text'}</span>
                </span>
                <span aria-hidden className="text-xl text-rs">→</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <button type="button" onClick={() => setStep('choice')} className="label mb-5 text-mute hover:text-paper">← {fr ? 'Autres options' : 'Other options'}</button>
            <h2 id="booking-title" className="pr-10 text-2xl font-bold uppercase leading-none tracking-tight sm:text-3xl">{d.title}</h2>
            <div className="rule mt-5" />
            <p className="mt-4 text-sm font-light text-mute">{d.sub}</p>
            <div className="mt-8">
              <BookingForm key={key} locale={locale} models={models} defaultModel={defaultModel} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const choice = 'flex w-full items-center gap-4 border border-line bg-ink px-5 py-4 transition hover:border-paper active:scale-[0.99]';

function Icon({ d, fill = 'currentColor' }: { d: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7 shrink-0" fill={fill}>
      <path d={d} />
    </svg>
  );
}
