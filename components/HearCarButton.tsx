"use client";

import { useState, useRef, useEffect } from "react";

export default function HearCarButton({ slug }: { slug: string }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Stop audio when clicking anywhere else on the page
  useEffect(() => {
    if (!playing) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setPlaying(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [playing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!audioRef.current) {
      audioRef.current = new Audio(`/sounds/${slug}.mp3`);
      audioRef.current.onended = () => setPlaying(false);
    }

    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`flex items-center gap-2.5 px-6 py-3.5 border-2 font-body text-sm tracking-[0.12em] uppercase transition-all duration-300 ${
        playing
          ? "border-yellow-500 bg-yellow-500 text-obsidian"
          : "border-yellow-500/70 text-yellow-500 hover:bg-yellow-500 hover:text-obsidian"
      }`}
    >
      {playing ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
            <rect x="6" y="5" width="4" height="14" rx="1"/>
            <rect x="14" y="5" width="4" height="14" rx="1"/>
          </svg>
          Stop Sound
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          Hear This Car
        </>
      )}
    </button>
  );
}