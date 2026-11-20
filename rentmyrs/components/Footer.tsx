import Link from 'next/link';
import { SITE, type Locale } from '@/lib/site';
import { t } from '@/lib/dict';
import { RS_MODELS } from '@/lib/fleet';

export default function Footer({ locale }: { locale: Locale }) {
  const d = t(locale);
  const prefix = locale === 'fr' ? '' : '/en';
  return (
    <footer className="border-t border-line bg-panel">
      <div className="rs-stripe h-1 opacity-60" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">RentMy<span className="text-rs">RS</span></p>
          <p className="mt-2 text-sm text-mute">{d.footer.tagline}</p>
          <a href={`tel:${SITE.phone}`} className="mt-4 inline-block text-sm hover:text-rs">{SITE.phoneDisplay}</a>
        </div>
        <ul className="space-y-2 text-sm">
          {RS_MODELS.map((m) => (
            <li key={m.id}>
              <Link href={`${prefix}/${m.slug[locale]}`} className="text-mute hover:text-paper">
                {locale === 'fr' ? `Location ${m.name} Montréal` : `${m.name} rental Montreal`}
              </Link>
            </li>
          ))}
        </ul>
        <div className="text-sm text-mute">
          <p>
            {d.footer.sister}{' '}
            <a href={SITE.sister.url} className="text-paper underline decoration-rs underline-offset-4 hover:text-rs">
              {SITE.sister.name}
            </a>
          </p>
          <p className="mt-4 text-xs leading-relaxed">{d.footer.disclaimer}</p>
          <p className="mt-4 text-xs">© {new Date().getFullYear()} RentMyRS. {d.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
