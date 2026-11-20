import localFont from 'next/font/local';

// Archivo (licence OFL) : grotesque à largeur variable, proche du style des sites RS.
export const archivo = localFont({
  src: [
    { path: '../app/fonts/archivo.woff2', style: 'normal' },
    { path: '../app/fonts/archivo-italic.woff2', style: 'italic' },
  ],
  variable: '--font-archivo',
  weight: '100 900',
  display: 'swap',
});
