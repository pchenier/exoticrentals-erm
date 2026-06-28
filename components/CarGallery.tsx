"use client";

import { useState } from "react";
import Image from "next/image";

interface CarGalleryProps {
  gallery: string[];
  carName: string;
  mainImage: string | null;
  imagePosition?: string | null;
}

export default function CarGallery({ gallery, carName, mainImage, imagePosition }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const allPhotos = gallery.length > 0 ? gallery : mainImage ? [mainImage] : [];
  const activePhoto = allPhotos[activeIndex] ?? mainImage;

  if (!activePhoto) return null;

  const objectPosition = imagePosition || 'center 50%';

  return (
    <div className="mb-12">
      {/* Main photo */}
      <div className="relative h-72 md:h-[480px] bg-[#111] overflow-hidden">
        <Image
          src={activePhoto}
          alt={`${carName} rental Montreal`}
          fill
          priority
          className="object-cover transition-opacity duration-300"
          style={{ objectPosition }}
          sizes="(max-width: 768px) 100vw, 1152px"
        />
      </div>

      {/* Thumbnail strip */}
      {allPhotos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {allPhotos.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-24 h-16 overflow-hidden border transition-all duration-200 ${
                i === activeIndex
                  ? "border-[#c9a96e]"
                  : "border-white/10 hover:border-white/40"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${carName} photo ${i + 1}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
