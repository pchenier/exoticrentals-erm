import Link from 'next/link';
import type { Locale } from '@/lib/site';
import { t } from '@/lib/dict';

export default function Header({ locale, otherHref }: { locale: Locale; otherHref?: string }) {
  const d = t(locale);
  const home = locale === 'fr' ? '/' : '/en';
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href={home} className="flex items-baseline gap-0.5 text-lg font-semibold tracking-tight" aria-label="RentMyRS">
          <span>RentMy</span>
          <span className="rounded-sm bg-rs px-1.5 py-0.5 text-sm font-bold italic leading-none text-white">RS</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-5">
          <a href={`${home}#rs`} className="hidden text-mute hover:text-paper sm:inline">{d.nav.fleet}</a>
          <a href={`${home}#lamborghini`} className="hidden text-mute hover:text-paper sm:inline">{d.nav.lambo}</a>
          <a href={`${home}#faq`} className="hidden text-mute hover:text-paper md:inline">{d.nav.faq}</a>
          <Link href={otherHref ?? d.nav.otherHref} hrefLang={locale === 'fr' ? 'en' : 'fr'} className="px-2 py-1 text-xs font-medium text-mute hover:text-paper">
            {d.nav.other}
          </Link>
          <a href={`${home}#reserver`} className="rounded-full bg-rs px-4 py-2 text-sm font-semibold text-white hover:bg-rs/90">
            {d.nav.book}
          </a>
        </nav>
      </div>
    </header>
  );
}
