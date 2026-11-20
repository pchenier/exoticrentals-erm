import Link from 'next/link';
import { SITE, type Locale } from '@/lib/site';
import { t } from '@/lib/dict';
import { RS_MODELS } from '@/lib/fleet';
import { Logo } from './ui';
import { GUIDE, NORTH } from '@/lib/seo';

export default function Footer({ locale }: { locale: Locale }) {
  const d = t(locale);
  const prefix = locale === 'fr' ? '' : '/en';
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 pb-24 pt-16 sm:grid-cols-3 sm:px-8 sm:pb-16 lg:px-16">
        <div>
          <Logo />
          <p className="mt-4 font-light text-mute">{d.footer.tagline}</p>
          <a href={`tel:${SITE.phone}`} className="wide mt-6 inline-block text-xl font-medium hover:text-rs">
            {SITE.phoneDisplay}
          </a>
        </div>
        <ul className="space-y-3">
          {RS_MODELS.map((m) => (
            <li key={m.id}>
              <Link href={`${prefix}/${m.slug[locale]}`} className="font-light text-mute hover:text-paper">
                {locale === 'fr' ? `Location ${m.name} Montréal` : `${m.name} rental Montreal`}
              </Link>
            </li>
          ))}
          <li>
            <Link href={GUIDE[locale]} className="font-light text-mute hover:text-paper">
              {locale === 'fr' ? 'Guide : quelle Audi RS louer ?' : 'Guide: which Audi RS to rent?'}
            </Link>
          </li>
          <li>
            <Link href={NORTH[locale]} className="font-light text-mute hover:text-paper">
              {locale === 'fr' ? 'Location Audi RS Rive-Nord' : 'Audi RS rental North Shore'}
            </Link>
          </li>
        </ul>
        <div className="font-light text-mute">
          <p>
            {d.footer.sister}{' '}
            <a href={SITE.sister.url} className="text-paper underline decoration-rs underline-offset-4 hover:text-rs">
              {SITE.sister.name}
            </a>
          </p>
          <p className="mt-6 text-xs leading-relaxed">{d.footer.disclaimer}</p>
          <p className="mt-4 text-xs">© {new Date().getFullYear()} RentMyRS. {d.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
