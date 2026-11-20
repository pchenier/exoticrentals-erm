'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

// Galerie de la page d'une auto (comme exoticrentalsmontreal.com) : grande photo qui défile
// toute seule (pause au survol) et vignettes cliquables en dessous.
export default function ModelGallery({
  images,
  alt,
  focuses,
  overlay,
  placeholder,
}: {
  images: string[];
  alt: string;
  focuses?: Record<string, string>;
  overlay?: React.ReactNode;
  placeholder?: React.ReactNode;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = images.length;

  useEffect(() => {
    if (paused || n <= 1) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), 3500);
    return () => clearTimeout(t);
  }, [i, paused, n]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="anim-photo relative aspect-[16/10] overflow-hidden border border-line bg-black">
        {n === 0
          ? placeholder
          : images.map((src, k) => (
              <Image
                key={src}
                src={src}
                alt={k === 0 ? alt : `${alt} ${k + 1}`}
                fill
                priority={k === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                style={{ objectPosition: focuses?.[src] ?? '50% 60%' }}
                className={`object-cover transition-opacity duration-700 ${k === i ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
        {overlay}
        {n > 1 && (
          <>
            <button type="button" aria-label="Précédente" onClick={() => setI((i - 1 + n) % n)} className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/50 text-xl transition hover:bg-black/80">‹</button>
            <button type="button" aria-label="Suivante" onClick={() => setI((i + 1) % n)} className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/50 text-xl transition hover:bg-black/80">›</button>
            <span className="label absolute bottom-2 right-2 z-20 bg-black/60 px-2 py-1 text-[10px]">{i + 1} / {n}</span>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((src, k) => (
            <button
              key={src}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Photo ${k + 1}`}
              className={`relative aspect-[16/10] overflow-hidden border transition ${k === i ? 'border-rs' : 'border-line opacity-60 hover:opacity-100'}`}
            >
              <Image src={src} alt="" fill sizes="120px" style={{ objectPosition: focuses?.[src] ?? '50% 60%' }} className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
