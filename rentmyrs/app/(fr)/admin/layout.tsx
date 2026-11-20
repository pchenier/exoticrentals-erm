import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | RentMyRS',
  robots: { index: false, follow: false },
  // Ouvert depuis l'écran d'accueil comme une app (requis pour les notifications sur iPhone).
  appleWebApp: { capable: true, title: 'RentMyRS', statusBarStyle: 'black' },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
