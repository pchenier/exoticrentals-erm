"use client";

import { useState, useEffect } from "react";

type ImageItem = { url: string; alt: string; isMain: boolean; position?: string };

const SLIDE_DURATION = 3500;

export default function VehicleLightboxGallery({
  images,
  make,
  model,
}: {
  images: ImageItem[];
  make: string;
  model: string;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const title = `${make} ${model}`;

  const validImages = images && images.length > 0
    ? images
    : [{ url: "/placeholder-car.jpg", alt: title, isMain: true }];

  useEffect(() => {
    if (paused || validImages.length <= 1) return;
    const timer = setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % validImages.length);
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [paused, currentIdx, validImages.length]);

  const goToImage = (idx: number) => {
    setCurrentIdx(idx);
  };

  if (validImages.length === 1) {
    return (
      <div className="aspect-[16/10] overflow-hidden bg-graphite">
        <img
          src={validImages[0].url}
          alt={validImages[0].alt || title}
          className="w-full h-full object-cover"
          style={{ objectPosition: validImages[0].position || "center" }}
        />
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Main image - auto slideshow */}
      <div className="aspect-[16/10] overflow-hidden mb-3 bg-graphite relative">
        {validImages.map((img, i) => (
          <img
            key={i}
            src={img.url}
            alt={img.alt || `${title} ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === currentIdx ? "opacity-100" : "opacity-0"
            }`}
            style={{ objectPosition: img.position || "center" }}
          />
        ))}

        {/* Dots in corner */}
        <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
          {validImages.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                goToImage(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIdx
                  ? "w-5 bg-champagne"
                  : "w-1.5 bg-warm-white/40 hover:bg-warm-white/70"
              }`}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {validImages.map((img, i) => (
          <div
            key={i}
            className={`aspect-square overflow-hidden bg-graphite cursor-pointer border-2 transition-colors ${
              i === currentIdx ? "border-champagne" : "border-transparent hover:border-silver/40"
            }`}
            onClick={() => goToImage(i)}
          >
            <img
              src={img.url}
              alt={`${title} ${i + 1}`}
              className="w-full h-full object-cover"
              style={{ objectPosition: img.position || "center" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}