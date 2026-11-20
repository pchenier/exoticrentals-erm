import Link from 'next/link';
import type { Locale } from '@/lib/site';
import { t } from '@/lib/dict';
import { Logo } from './ui';

export default function Header({ locale, otherHref }: { locale: Locale; otherHref?: string }) {
  const d = t(locale);
  const home = locale === 'fr' ? '/' : '/en';
  const link = 'label text-paper/70 transition hover:text-paper';
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-black/80 to-transparent">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:h-20 sm:px-8">
        <Link href={home} aria-label="RentMyRS"><Logo /></Link>
        <nav className="flex items-center gap-4 sm:gap-8">
          <a href={`${home}#rs`} className={`${link} hidden sm:inline`}>{d.nav.fleet}</a>
          <a href={`${home}#lamborghini`} className={`${link} hidden sm:inline`}>{d.nav.lambo}</a>
          <a href={`${home}#faq`} className={`${link} hidden md:inline`}>{d.nav.faq}</a>
          <Link href={otherHref ?? d.nav.otherHref} hrefLang={locale === 'fr' ? 'en' : 'fr'} className={link}>
            {d.nav.other}
          </Link>
          <a href="#reserver" className="label bg-paper px-4 py-2.5 text-ink transition hover:bg-rs hover:text-paper">
            {d.nav.book}
          </a>
        </nav>
      </div>
    </header>
  );
}
