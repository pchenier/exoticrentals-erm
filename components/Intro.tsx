"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { vehicles } from "@/lib/data";
import ERMLogo from "./ERMLogo";

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"zoom-in" | "standstill" | "zoom-out" | "fade">("zoom-in");
  const [skipped, setSkipped] = useState(false);
  const [showBrand, setShowBrand] = useState(false);

  const featuredVehicles = vehicles.filter(v => v.featured).slice(0, 6);

  useEffect(() => {
    const hasVisited = localStorage.getItem("pmr_visited");
    if (hasVisited) {
      setSkipped(true);
      onComplete();
      return;
    }

    const brandTimer = setTimeout(() => setShowBrand(true), 800);

    let index = 0;
    let timeoutId: NodeJS.Timeout;

    const runCycle = () => {
      if (index >= featuredVehicles.length) {
        setPhase("fade");
        setTimeout(() => {
          localStorage.setItem("pmr_visited", "1");
          onComplete();
        }, 1200);
        return;
      }

      setCurrentIndex(index);
      setPhase("zoom-in");

      timeoutId = setTimeout(() => {
        setPhase("standstill");
        timeoutId = setTimeout(() => {
          setPhase("zoom-out");
          timeoutId = setTimeout(() => {
            index++;
            runCycle();
          }, 1200);
        }, 2000);
      }, 1200);
    };

    runCycle();

    return () => {
      clearTimeout(brandTimer);
      clearTimeout(timeoutId);
    };
  }, [onComplete, featuredVehicles.length]);

  if (skipped) return null;

  const currentVehicle = featuredVehicles[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-obsidian overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background image with zoom effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ scale: 1.3, opacity: 0 }}
            animate={
              phase === "zoom-in"
                ? { scale: 1.1, opacity: 1 }
                : phase === "standstill"
                ? { scale: 1.05, opacity: 1 }
                : phase === "zoom-out"
                ? { scale: 1, opacity: 0.8 }
                : { scale: 1, opacity: 0 }
            }
            exit={{ opacity: 0 }}
            transition={{
              duration: phase === "zoom-in" ? 1.2 : phase === "standstill" ? 2 : 1.2,
              ease: phase === "zoom-in" ? "easeOut" : phase === "standstill" ? "linear" : "easeIn",
            }}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${currentVehicle?.images[0]?.url || "/placeholder-car.jpg"})`,
                backgroundPosition: currentVehicle?.images[0]?.position || "center",
                filter: "brightness(0.4)",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/50" />

        {/* Brand reveal */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: showBrand ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Metallic line */}
          <motion.div
            className="w-24 h-px bg-gradient-to-r from-transparent via-champagne to-transparent mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: showBrand ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          {/* PMR Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showBrand ? 1 : 0, y: showBrand ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ERMLogo size="xl" showWordmark={true} animated={false} />
          </motion.div>
        </motion.div>

        {/* Vehicle info */}
        <motion.div
          className="absolute bottom-16 left-0 right-0 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-xs font-spec tracking-[0.3em] text-champagne mb-2">
            {currentVehicle?.make.toUpperCase()}
          </div>
          <div className="font-display text-2xl md:text-3xl text-warm-white">
            {currentVehicle?.model}
          </div>
          <div className="text-sm text-silver mt-1">
            ${currentVehicle?.dailyRate.toLocaleString()}/day
          </div>
        </motion.div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredVehicles.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                i === currentIndex ? "bg-champagne w-4" : "bg-warm-white/20"
              }`}
            />
          ))}
        </div>

        {/* Skip button */}
        <button
          onClick={() => {
            localStorage.setItem("pmr_visited", "1");
            onComplete();
          }}
          className="absolute top-6 right-6 text-silver text-xs tracking-[0.2em] hover:text-champagne transition-colors z-10"
        >
          SKIP INTRO
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
