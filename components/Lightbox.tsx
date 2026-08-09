"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Vehicle } from "@/lib/data";

type ImageItem = { url: string; alt: string; isMain: boolean; position?: string };

let openLightboxFn: ((images: ImageItem[], title: string, startIndex?: number) => void) | null = null;

export function openLightbox(images: ImageItem[], title: string, startIndex = 0) {
  openLightboxFn?.(images, title, startIndex);
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [title, setTitle] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);

  const open = useCallback((imgs: ImageItem[], t: string, startIdx: number = 0) => {
    setImages(imgs);
    setTitle(t);
    setCurrentIdx(startIdx);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    openLightboxFn = open;
    return () => { openLightboxFn = null; };
  }, [open]);

  const close = useCallback(() => setIsOpen(false), []);

  const next = useCallback(() => {
    setCurrentIdx((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIdx((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, next, prev]);

  return (
    <>
      {children}
      <AnimatePresence>
        {isOpen && images.length > 0 && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 text-white/80 hover:text-champagne transition-colors p-2"
              aria-label="Close"
            >
              <X size={28} />
            </button>

            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
              <div className="text-warm-white font-display font-bold text-lg">{title}</div>
              <div className="text-silver text-sm">{currentIdx + 1} / {images.length}</div>
            </div>

            {/* Prev */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-champagne transition-colors p-4 h-full flex items-center"
                aria-label="Previous"
              >
                <ChevronLeft size={40} />
              </button>
            )}

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center p-12" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIdx}
                  src={images[currentIdx]?.url}
                  alt={images[currentIdx]?.alt || title}
                  className="max-w-full max-h-full object-contain"
                  style={{ objectPosition: images[currentIdx]?.position || "center" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
            </div>

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-champagne transition-colors p-4 h-full flex items-center"
                aria-label="Next"
              >
                <ChevronRight size={40} />
              </button>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-[90%] overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
                    className={`flex-shrink-0 w-14 h-10 rounded overflow-hidden border-2 transition-colors ${
                      i === currentIdx ? "border-champagne" : "border-transparent hover:border-silver/50"
                    }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}