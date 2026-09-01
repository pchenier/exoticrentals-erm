"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Vehicle } from "@/lib/data";
import BookingModal from "./BookingModal";

export default function VehicleCard({ vehicle, index = 0 }: { vehicle: Vehicle; index?: number }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const images = vehicle.images.length > 0 ? vehicle.images : [{ url: "/placeholder-car.jpg", alt: `${vehicle.make} ${vehicle.model}`, isMain: true }];

  return (
    <>
      <motion.article
        key={vehicle.id}
        className="group bg-graphite border border-graphite hover:border-silver/20 transition-all overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: Math.min(index * 0.04, 0.2) }}
        style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
      >
        {/* Image - links to detail page */}
        <Link href={`/fleet/${vehicle.slug}`} className="block relative aspect-[16/10] overflow-hidden">
          <img
            src={images[0]?.url || "/placeholder-car.jpg"}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ objectPosition: images[0]?.position || "center" }}
          />
          {vehicle.premierVerified && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 flex items-center gap-1.5 z-10">
              <img src="/turo-logo.png" alt="Turo" width="44" height="16" className="h-4 w-auto" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-obsidian">Verified</span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-4 md:p-5">
          <h3 className="font-display font-bold text-xl tracking-[-0.02em] text-warm-white mb-4">
            {vehicle.make.toUpperCase()} {vehicle.model.toUpperCase()}
          </h3>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5 text-sm">
            <div>
              <div className="text-xs text-silver mb-0.5 tracking-wider uppercase">Power</div>
              <div className="text-warm-white">{vehicle.horsepower} BHP</div>
            </div>
            <div>
              <div className="text-xs text-silver mb-0.5 tracking-wider uppercase">Engine</div>
              <div className="text-warm-white">{vehicle.engine}</div>
            </div>
            <div>
              <div className="text-xs text-silver mb-0.5 tracking-wider uppercase">Transmission</div>
              <div className="text-warm-white">{vehicle.transmission}</div>
            </div>
            <div>
              <div className="text-xs text-silver mb-0.5 tracking-wider uppercase">Daily</div>
              <div className="text-champagne font-display font-bold text-lg">${vehicle.dailyRate.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setBookingOpen(true)}
              className="flex-1 py-2.5 text-center text-xs font-body font-bold tracking-[0.1em] border border-silver/30 text-silver hover:border-champagne hover:text-champagne transition-colors"
            >
              BOOK
            </button>
            <Link
              href={`/fleet/${vehicle.slug}`}
              className="flex-1 py-2.5 text-center text-xs font-body font-bold tracking-[0.1em] bg-champagne text-obsidian hover:bg-champagne/90 transition-colors"
            >
              SPECS →
            </Link>
          </div>
        </div>
      </motion.article>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        vehicleName={`${vehicle.make} ${vehicle.model}`}
        vehicleId={vehicle.id}
      />
    </>
  );
}