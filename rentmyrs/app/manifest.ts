import type { MetadataRoute } from 'next';

// Permet d'ajouter /admin à l'écran d'accueil (obligatoire sur iPhone pour recevoir les notifications).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RentMyRS Admin',
    short_name: 'RentMyRS',
    start_url: '/admin',
    scope: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
