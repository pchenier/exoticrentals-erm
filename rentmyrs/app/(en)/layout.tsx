import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { archivo } from '@/lib/fonts';
import { SITE } from '@/lib/site';
import { t } from '@/lib/dict';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: t('en').meta.title,
  description: t('en').meta.description,
};

export const viewport: Viewport = { themeColor: '#0a0a0b' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={t('en').htmlLang} className={archivo.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
