"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { vehicles as staticVehicles } from "@/lib/data";
import type { Vehicle } from "@/lib/data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";

const makes = [...new Set(["Audi","Bentley","BMW","Cadillac","Lamborghini","McLaren","Mercedes-AMG","Mercedes-Maybach","Porsche","Range Rover"])].sort();

const makeLogoMap: Record<string, string> = {
  "Audi": "audi",
  "Bentley": "bentley",
  "BMW": "bmw",
  "Cadillac": "cadillac",
  "Lamborghini": "lamborghini",
  "McLaren": "mclaren",
  "Mercedes-AMG": "mercedes",
  "Mercedes-Maybach": "mercedes",
  "Porsche": "porsche",
  "Range Rover": "range-rover",
};

function getMakeLogo(make: string): string | null {
  return makeLogoMap[make] ? `/brands/${makeLogoMap[make]}.svg` : null;
}

const priceRanges = [
  { label: "ALL", min: 0, max: Infinity },
  { label: "UNDER $500", min: 0, max: 499 },
  { label: "$500 - $699", min: 500, max: 699 },
  { label: "$700 - $999", min: 700, max: 999 },
  { label: "$1,000+", min: 1000, max: Infinity },
];

function FleetContent({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const searchParams = useSearchParams();
  const [activeMake, setActiveMake] = useState(searchParams.get("make") || "ALL");
  const [activePrice, setActivePrice] = useState(searchParams.get("price") || "ALL");
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>(initialVehicles.length > 0 ? initialVehicles : staticVehicles);

  // Only fetch client-side if server didn't provide live data (fallback)
  useEffect(() => {
    if (initialVehicles.length === 0) {
      fetch('/api/vehicles')
        .then(r => r.json())
        .then(data => { if (Array.isArray(data) && data.length > 0) setAllVehicles(data); })
        .catch(() => {});
    }
  }, [initialVehicles.length]);

  let filtered = allVehicles.filter(v => v.available);

  if (activeMake !== "ALL") {
    filtered = filtered.filter(v => v.make === activeMake);
  }

  if (activePrice !== "ALL") {
    const range = priceRanges.find(r => r.label === activePrice);
    if (range) {
      filtered = filtered.filter(v => v.dailyRate >= range.min && v.dailyRate <= range.max);
    }
  }

  filtered.sort((a, b) => {
    const makeCompare = a.make.localeCompare(b.make);
    if (makeCompare !== 0) return makeCompare;
    return (a.displayOrder ?? 99) - (b.displayOrder ?? 99);
  });

  return (
    <main className="pt-20 md:pt-24 pb-24 lg:pb-16 px-4 sm:px-6 lg:px-8 bg-obsidian min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">THE FLEET</div>
          <h1 className="font-display font-extrabold tracking-[-0.02em] text-3xl md:text-4xl text-warm-white mb-4">The Premier Collection</h1>
          <p className="text-silver max-w-2xl mx-auto">A carefully selected collection of exotic cars, refined luxury vehicles, and performance SUVs. Pick up at our Montreal location or arrange delivery by special request.</p>
        </div>

        {/* Brand filters */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveMake("ALL")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-body font-bold tracking-[0.1em] transition-colors ${activeMake === "ALL" ? "bg-champagne text-obsidian" : "text-silver hover:text-warm-white border border-graphite"}`}
            >
              ALL
            </button>
            {makes.map((make) => {
              const logo = getMakeLogo(make);
              return (
                <button
                  key={make}
                  onClick={() => setActiveMake(make)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-body font-bold tracking-[0.1em] transition-colors ${activeMake === make ? "bg-champagne text-obsidian" : "text-silver hover:text-warm-white border border-graphite"}`}
                >
                  {logo && (
                    <img
                      src={logo}
                      alt={`${make} logo`}
                      className={`h-4 w-auto ${activeMake === make ? "brightness-0" : ""}`}
                    />
                  )}
                  {make.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {priceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => setActivePrice(range.label)}
                className={`px-4 py-2 text-xs font-body font-bold tracking-[0.1em] transition-colors ${activePrice === range.label ? "bg-champagne text-obsidian" : "text-silver hover:text-warm-white border border-graphite"}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-silver mb-4">No vehicles match your filters.</p>
            <button
              onClick={() => { setActiveMake("ALL"); setActivePrice("ALL"); }}
              className="text-champagne hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function FleetClient({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  return (
    <>
      <Navigation />
      <Suspense fallback={<main className="pt-24 pb-16 px-4 bg-obsidian min-h-screen"><div className="max-w-7xl mx-auto text-center text-silver">Loading...</div></main>}>
        <FleetContent initialVehicles={initialVehicles} />
      </Suspense>
      <Footer />
    </>
  );
}