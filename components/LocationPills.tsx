"use client";
import Link from "next/link";
import { LOCATIONS } from "@/lib/locations";

const neighbourhoods = LOCATIONS.filter((loc) => loc.type === "neighbourhood");
const cities = LOCATIONS.filter((loc) => loc.type === "city");

export default function LocationPills() {
  return (
    <section className="bg-[#0a0a0a] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-3xl md:text-5xl mb-4 text-center uppercase tracking-wide text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Available Across Montreal and Quebec
        </h2>
        <p
          className="text-center text-gray-400 mb-10 text-base max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          We deliver to every Montreal neighbourhood and across Quebec. Choose your location and we bring the car to you.
        </p>

        {/* Montreal Neighbourhoods */}
        <div className="mb-6">
          <p
            className="text-[10px] tracking-[0.3em] text-[#c9a96e] uppercase mb-4 font-light"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Montreal Neighbourhoods
          </p>
          <div className="flex flex-wrap gap-2">
            {neighbourhoods.map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/25 transition-all duration-200"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Quebec Cities */}
        <div>
          <p
            className="text-[10px] tracking-[0.3em] text-[#c9a96e] uppercase mb-4 font-light"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Quebec Cities
          </p>
          <div className="flex flex-wrap gap-2">
            {cities.map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/25 transition-all duration-200"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
