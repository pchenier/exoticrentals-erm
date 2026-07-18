"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackWhatsAppClick } from "@/lib/analytics";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";

interface Car {
  id: number;
  name: string;
  nickname: string;
  rate: number;
  description: string;
  specs: string;
  engine: string;
  hp: string;
  sprint: string;
  accent: string;
  gradientFrom: string;
  gradientTo: string;
  glow: string;
  image?: string;
  gallery: string[];
  originalRate?: number;
  deposit?: number | null;
  coming_soon?: boolean;
  image_position?: string | null;
  rate_3d?: number | null;
  rate_7d?: number | null;
  rate_14d?: number | null;
  rate_30d?: number | null;
}

// Duration options for the pricing selector
const DURATIONS = [
  { key: '1d', label: '1 Day', days: 1, field: null },
  { key: '3d', label: '3 Days', days: 3, field: 'rate_3d' as const },
  { key: '7d', label: '7 Days', days: 7, field: 'rate_7d' as const },
  { key: '14d', label: '14 Days', days: 14, field: 'rate_14d' as const },
  { key: '30d', label: '30 Days', days: 30, field: 'rate_30d' as const },
];

// Visual config per car name (aesthetic only, not stored in DB)
const VISUAL_CONFIG: Record<string, Partial<Car>> = {
  "Audi RS5": { accent: "#c9a96e", gradientFrom: "#181818", gradientTo: "#0e0e0e", glow: "rgba(201,169,110,0.08)" },
  "Audi RS6": { accent: "#c9a96e", gradientFrom: "#181818", gradientTo: "#0e0e0e", glow: "rgba(201,169,110,0.06)" },
  "Audi RS7": { accent: "#c9a96e", gradientFrom: "#1a1a1a", gradientTo: "#0f0f0f", glow: "rgba(201,169,110,0.08)" },
  "BMW M5 Competition": { accent: "#c9a96e", gradientFrom: "#1c1c1c", gradientTo: "#0f0f0f", glow: "rgba(201,169,110,0.07)" },
  "BMW M4":             { accent: "#0066cc", gradientFrom: "#0a0d12", gradientTo: "#060810", glow: "rgba(0,102,204,0.10)" },
  "Audi R8": { accent: "#ffffff", gradientFrom: "#222222", gradientTo: "#111111", glow: "rgba(255,255,255,0.05)" },
  "McLaren 600LT": { accent: "#c9a96e", gradientFrom: "#1a1510", gradientTo: "#0f0d0a", glow: "rgba(201,169,110,0.12)" },
  "Porsche Panamera GTS": { accent: "#c9293e", gradientFrom: "#1a0d0f", gradientTo: "#0d0809", glow: "rgba(194,41,62,0.12)" },
  "Porsche Macan GTS":   { accent: "#c9293e", gradientFrom: "#1a0d0f", gradientTo: "#0d0809", glow: "rgba(194,41,62,0.12)" },
  "Lamborghini Urus": { accent: "#c9a96e", gradientFrom: "#1a1a1a", gradientTo: "#0d0d0d", glow: "rgba(201,169,110,0.1)" },
  "Mercedes G63 AMG":     { accent: "#c9a96e", gradientFrom: "#181818", gradientTo: "#0e0e0e", glow: "rgba(201,169,110,0.09)" },
  "Mercedes C43 AMG":     { accent: "#c9a96e", gradientFrom: "#181818", gradientTo: "#0e0e0e", glow: "rgba(201,169,110,0.08)" },
  "Jeep Grand Cherokee SRT": { accent: "#c9293e", gradientFrom: "#1a0a0a", gradientTo: "#0d0606", glow: "rgba(194,41,62,0.10)" },
};

// Brand detection
function getBrand(name: string): string {
  if (name.startsWith('Audi')) return 'Audi';
  if (name.startsWith('BMW')) return 'BMW';
  if (name.startsWith('Mercedes')) return 'Mercedes';
  if (name.startsWith('Ferrari')) return 'Ferrari';
  if (name.startsWith('Porsche')) return 'Porsche';
  if (name.startsWith('Lamborghini')) return 'Lamborghini';
  if (name.startsWith('McLaren')) return 'McLaren';
  if (name.startsWith('Jeep')) return 'Jeep';
  if (name.startsWith('Cadillac')) return 'Cadillac';
  if (name.startsWith('Bentley')) return 'Bentley';
  if (name.startsWith('Rolls')) return 'Rolls Royce';
  if (name.startsWith('Range Rover')) return 'Range Rover';
  return 'Other';
}

// Brands list (in display order)
const BRANDS = ['All', 'Lamborghini', 'McLaren', 'Porsche', 'Mercedes', 'BMW', 'Audi', 'Jeep', 'Cadillac', 'Bentley', 'Rolls Royce', 'Range Rover'];

// Brand logos — real brand SVGs/PNGs
const BRAND_LOGO_FILES: Record<string, string> = {
  Audi: '/brands/audi.svg',
  BMW: '/brands/bmw.svg',
  Mercedes: '/brands/mercedes.svg',
  Ferrari: '/brands/ferrari.svg',
  Porsche: '/brands/porsche.svg',
  Lamborghini: '/brands/lamborghini.svg',
  McLaren: '/brands/mclaren.svg',
  Jeep: '/brands/jeep.svg',
  Cadillac: '/brands/cadillac.svg',
  Bentley: '/brands/bentley.svg',
  'Rolls Royce': '/brands/rolls-royce.svg',
  'Range Rover': '/brands/range-rover.svg',
};

function BrandLogo({ brand, size = 28 }: { brand: string; size?: number }) {
  const src = BRAND_LOGO_FILES[brand];
  if (!src) return <span className="text-xs tracking-widest opacity-50">{brand}</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={brand}
      width={size}
      height={size}
      className="object-contain"
      style={{ filter: 'brightness(0) invert(1)', maxWidth: brand === 'Audi' ? 52 : size, maxHeight: size }}
    />
  );
}

// Price ranges
const PRICE_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under $500', min: 0, max: 499 },
  { label: '$500 – $699', min: 500, max: 699 },
  { label: '$700 – $999', min: 700, max: 999 },
  { label: '$1,000+', min: 1000, max: Infinity },
];

const DEFAULT_VISUAL: Partial<Car> = {
  accent: "#c9a96e",
  gradientFrom: "#181818",
  gradientTo: "#0e0e0e",
  glow: "rgba(201,169,110,0.08)",
};

// DB row shape (snake_case)
interface DBCar {
  id: number;
  name: string;
  nickname: string | null;
  rate: number;
  original_rate: number | null;
  description: string | null;
  specs: string | null;
  engine: string | null;
  hp: string | null;
  sprint: string | null;
  image: string | null;
  gallery: string[];
  deposit: number | null;
  image_position: string | null;
  coming_soon: boolean;
  sort_order: number;
  rate_3d: number | null;
  rate_7d: number | null;
  rate_14d: number | null;
  rate_30d: number | null;
}

function mapDBCar(raw: DBCar): Car {
  const visual = VISUAL_CONFIG[raw.name] ?? DEFAULT_VISUAL;
  return {
    id: raw.id,
    name: raw.name,
    nickname: raw.nickname ?? "",
    rate: raw.rate,
    originalRate: raw.original_rate ?? undefined,
    description: raw.description ?? "",
    specs: (() => {
      if (!raw.specs) return "";
      let obj = raw.specs;
      if (typeof obj === "string") { try { obj = JSON.parse(obj); } catch { return obj; } }
      if (typeof obj === "object") return Object.entries(obj as Record<string,string>).map(([k,v]) => `${v} ${k}`).join(" · ");
      return String(obj);
    })(),
    engine: raw.engine ?? "",
    hp: raw.hp ?? "",
    sprint: raw.sprint ?? "",
    image: raw.image ?? undefined,
    gallery: Array.isArray(raw.gallery) ? raw.gallery : [],
    deposit: raw.deposit ?? null,
    coming_soon: raw.coming_soon,
    image_position: raw.image_position ?? null,
    rate_3d: raw.rate_3d ?? null,
    rate_7d: raw.rate_7d ?? null,
    rate_14d: raw.rate_14d ?? null,
    rate_30d: raw.rate_30d ?? null,
    accent: visual.accent ?? "#c9a96e",
    gradientFrom: visual.gradientFrom ?? "#181818",
    gradientTo: visual.gradientTo ?? "#0e0e0e",
    glow: visual.glow ?? "rgba(201,169,110,0.08)",
  };
}


export default function Fleet() {
  const [cars, setCars] = useState<Car[]>([]);
  const [fleetLoading, setFleetLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [modalCar, setModalCar] = useState<Car | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch fleet from API
  useEffect(() => {
    fetch('/api/fleet')
      .then((r) => r.json())
      .then((data: DBCar[]) => {
        setCars(data.map(mapDBCar));
        setFleetLoading(false);
      })
      .catch(() => setFleetLoading(false));
  }, []);

  useEffect(() => {
    if (modalCar) {
      requestAnimationFrame(() => requestAnimationFrame(() => setModalVisible(true)));
    } else {
      setModalVisible(false);
    }
  }, [modalCar]);

  const openModal = (car: Car) => setModalCar(car);
  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setModalCar(null), 200);
  };

  const handleBookCar = (carName: string) => {
    const message = `Hi, I'm interested in renting the ${carName}. Is it available?`;
    trackWhatsAppClick(`fleet_book_${carName}`);
    window.open(`https://wa.me/14385339053?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Filtered cars
  const filteredCars = cars.filter((car) => {
    const brandMatch = selectedBrand === 'All' || getBrand(car.name) === selectedBrand;
    const priceRange = PRICE_RANGES.find((r) => r.label === selectedPrice) ?? PRICE_RANGES[0];
    const priceMatch = car.rate >= priceRange.min && car.rate <= priceRange.max;
    return brandMatch && priceMatch;
  });


  return (
    <section id="fleet" className="py-32 bg-[#0a0a0a] relative">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-4 font-light">
            Our Collection
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light tracking-wide text-white mb-6">
            The Fleet
          </h2>
          <p className="text-white/40 text-sm max-w-lg mx-auto font-light leading-relaxed tracking-wide">
            Each vehicle is meticulously maintained, fully detailed before every
            rental, and delivered with the care it deserves.
          </p>
          <div className="w-16 h-px bg-[#c9a96e] mx-auto mt-8" />
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-5">
          {/* Brand filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {BRANDS.map((brand) => {
              const active = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`flex flex-col items-center gap-2 px-4 py-3 border transition-all duration-300 min-w-[72px] ${
                    active
                      ? 'border-[#c9a96e] text-[#c9a96e] bg-[#c9a96e]/5'
                      : 'border-white/10 text-white/30 hover:border-white/25 hover:text-white/60'
                  }`}
                >
                  {brand === 'All' ? (
                    <span className="text-lg leading-none">✦</span>
                  ) : (
                    <BrandLogo brand={brand} />
                  )}
                  <span className="text-[9px] tracking-[0.25em] uppercase font-light">{brand}</span>
                </button>
              );
            })}
          </div>

          {/* Price filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {PRICE_RANGES.map((range) => {
              const active = selectedPrice === range.label;
              return (
                <button
                  key={range.label}
                  onClick={() => setSelectedPrice(range.label)}
                  className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase font-light border transition-all duration-200 ${
                    active
                      ? 'border-[#c9a96e] text-[#c9a96e] bg-[#c9a96e]/5'
                      : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading state */}
        {fleetLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-white/5 h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          filteredCars.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/20 text-sm tracking-widest uppercase font-light">No vehicles match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car, index) => (
                <CarCard
                  key={car.id}
                  car={car}
                  index={index}
                  totalCars={filteredCars.length}
                  onOpen={() => openModal(car)}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Detail Modal */}
      {modalCar && (
        <CarDetailModal
          car={modalCar}
          visible={modalVisible}
          onClose={closeModal}
          onBook={() => handleBookCar(modalCar.name)}
        />
      )}

      {/* SEO: static links for crawler discovery */}
      <div className="sr-only" aria-hidden="true">
        <Link href="/cars/audi-rs5">Audi RS5 Rental Montreal</Link>
        <Link href="/cars/audi-rs6">Audi RS6 Rental Montreal</Link>
        <Link href="/cars/audi-rs7">Audi RS7 Rental Montreal</Link>
        <Link href="/cars/audi-r8">Audi R8 Rental Montreal</Link>
        <Link href="/cars/bmw-m3-competition-isle-of-man-green">BMW M3 Competition Rental Montreal</Link>
        <Link href="/cars/bmw-m5-competition">BMW M5 Competition Rental Montreal</Link>
        <Link href="/cars/bmw-x5-m-competition">BMW X5 M Competition Rental Montreal</Link>
        <Link href="/cars/mercedes-benz-e63s-amg">Mercedes-Benz E63S AMG Rental Montreal</Link>
        <Link href="/cars/mercedes-benz-s63-amg">Mercedes-Benz S63 AMG Rental Montreal</Link>
        <Link href="/cars/mercedes-g63-amg">Mercedes G63 AMG Rental Montreal</Link>
        <Link href="/cars/ferrari-488-gtb">Ferrari 488 GTB Rental Montreal</Link>
        <Link href="/cars/porsche-911-4s-techart">Porsche 911 4S Techart Rental Montreal</Link>
        <Link href="/cars/lamborghini-urus-black-on-black">Lamborghini Urus Rental Montreal</Link>
        <Link href="/cars/lamborghini-urus-blue-on-blue">Lamborghini Urus Blue Rental Montreal</Link>
        <Link href="/cars/lamborghini-urus-grey">Lamborghini Urus Grey Rental Montreal</Link>
        <Link href="/cars/lamborghini-huracan-tecnica">Lamborghini Huracan Tecnica Rental Montreal</Link>
        <Link href="/cars/lamborghini-huracan-evo">Lamborghini Huracan Evo Rental Montreal</Link>
        <Link href="/cars/lamborghini-huracan-evo-spyder">Lamborghini Huracan Evo Spyder Rental Montreal</Link>
        <Link href="/cars/mclaren-570gt">McLaren 570GT Rental Montreal</Link>
        <Link href="/cars/mclaren-600lt">McLaren 600LT Rental Montreal</Link>
        <Link href="/luxury-car-rental-montreal">Luxury Car Rental Montreal</Link>
        <Link href="/audi-rental-montreal">Audi Rental Montreal</Link>
        <Link href="/mercedes-rental-montreal">Mercedes Rental Montreal</Link>
        <Link href="/car-rental-montreal">Car Rental Montreal</Link>
      </div>
    </section>
  );
}

function CarCard({
  car,
  index,
  totalCars,
  onOpen,
}: {
  car: Car;
  index: number;
  totalCars: number;
  onOpen: () => void;
}) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);

  const handleCardClick = () => {
    if (isMobile) {
      router.push(`/cars/${slugify(car.name)}`);
    } else {
      onOpen();
    }
  };

  const isLast = index === totalCars - 1;
  const isFeatured = !!car.originalRate; // only cars with a discount get Featured
  const isPriority = index < 2;
  const isComingSoon = car.coming_soon || !car.image;

  return (
    <div
      onClick={handleCardClick}
      style={isFeatured ? { animation: 'featured-pulse 3s ease-in-out infinite' } : undefined}
      className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:brightness-110 hover:shadow-2xl ${
        isLast ? "md:col-span-2 lg:col-span-1" : ""
      }`}
    >
      {/* Image Area — full bleed, no border */}
      <div
        className="relative h-72 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${car.gradientFrom} 0%, ${car.gradientTo} 100%)`,
        }}
      >
        {isFeatured && (
          <span className="absolute top-3 left-3 z-10 text-[9px] tracking-[0.3em] uppercase text-[#c9a96e] border border-[#c9a96e]/40 px-2 py-1 bg-[#0a0a0a]/80 backdrop-blur-sm">
            Sale
          </span>
        )}
        {/* Brand logo */}
        <div className="absolute top-3 right-3 z-10 text-white/50">
          <BrandLogo brand={getBrand(car.name)} size={22} />
        </div>
        {!isComingSoon && car.image ? (
          <>
            <Image
              src={car.image}
              alt={car.name}
              fill
            className="object-cover md:group-hover:scale-105 transition-transform duration-700"
            style={{ objectPosition: car.image_position || 'center 50%' }}
            {...(isPriority ? { priority: true } : { loading: "lazy" })}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Bottom gradient overlay for text */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2/3 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)' }}
          />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: `radial-gradient(ellipse at center, ${car.glow} 0%, transparent 70%)`,
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon-512.png" alt="Exotic Rentals" width={64} height={64} loading="lazy" className="opacity-20 mb-4" />
              <div className="w-16 h-px bg-[#c9a96e]/30 mb-3" />
              <span className="text-[10px] tracking-[0.4em] text-[#c9a96e]/50 uppercase font-light">
                Coming Soon
              </span>
            </div>
          </>
        )}

        {/* Specs badge → replaced by overlay info below */}

      </div>

      {/* Info overlay — absolute on top of the photo */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="flex items-end justify-between">
          <div>
            {isFeatured && (
              <span className="block text-[9px] tracking-[0.3em] uppercase text-[#c9a96e] mb-1 font-light">Sale</span>
            )}
            <h3 className="font-display text-xl font-light tracking-wide text-white group-hover:text-[#c9a96e] transition-colors duration-300 leading-tight">
              {car.name}
            </h3>
            <p className="text-[10px] text-white/40 mt-1 font-light tracking-wide">{car.specs}</p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            {car.originalRate && (
              <span className="block text-[10px] text-white/30 line-through tracking-wide">
                ${car.originalRate.toLocaleString()}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-light text-[#c9a96e]">
                ${car.rate.toLocaleString()}
              </span>
              <span className="text-[10px] text-white/40 tracking-wide">/ day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Duration Selector Component ───────────────────────────────────────
function DurationSelector({ car }: { car: Car }) {
  const [selected, setSelected] = useState('1d');

  const current = DURATIONS.find(d => d.key === selected) ?? DURATIONS[0];
  const price = current.field ? (car[current.field] ?? null) : car.rate;
  const total = price ? price * current.days : null;

  // Filter available durations (only show if rate exists)
  const available = DURATIONS.filter(d => {
    if (!d.field) return true; // 1 day always available
    return car[d.field] != null && car[d.field]! > 0;
  });

  // If only 1 day available, just show the price
  if (available.length <= 1) {
    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-light border border-[#c9a96e] text-[#c9a96e] bg-[#c9a96e]/5">1 Day</span>
        </div>
        <div className="flex items-baseline gap-1">
          {car.originalRate && <span className="text-[11px] text-white/30 line-through tracking-wide mr-2">${car.originalRate.toLocaleString()}</span>}
          <span className="font-display text-3xl font-light text-[#c9a96e]">${car.rate.toLocaleString()}</span>
          <span className="text-[10px] text-white/30 tracking-wide">/ day</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {available.map(d => (
          <button
            key={d.key}
            onClick={() => setSelected(d.key)}
            className={`px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-light border transition-all duration-200 ${
              selected === d.key
                ? 'border-[#c9a96e] text-[#c9a96e] bg-[#c9a96e]/5'
                : 'border-white/10 text-white/30 hover:border-white/25 hover:text-white/60'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className="flex items-baseline gap-2">
        {car.originalRate && selected === '1d' && (
          <span className="text-[11px] text-white/30 line-through tracking-wide">${car.originalRate.toLocaleString()}</span>
        )}
        <span className="font-display text-3xl font-light text-[#c9a96e]">
          ${price != null ? price.toLocaleString() : car.rate.toLocaleString()}
        </span>
        <span className="text-[10px] text-white/30 tracking-wide">/ day</span>
        {total != null && current.days > 1 && (
          <>
            <span className="text-white/10 mx-1">·</span>
            <span className="text-[11px] text-white/40 tracking-wide">${total.toLocaleString()} total</span>
          </>
        )}
      </div>
      {current.days > 1 && total != null && (
        <p className="text-[10px] text-[#c9a96e]/60 mt-1 tracking-wide">
          Save ${((car.rate * current.days) - total).toLocaleString()} vs daily rate
        </p>
      )}
    </div>
  );
}

function CarDetailModal({
  car,
  visible,
  onClose,
  onBook,
}: {
  car: Car;
  visible: boolean;
  onClose: () => void;
  onBook: () => void;
}) {
  const [activePhoto, setActivePhoto] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`max-w-4xl w-full mx-4 bg-[#111111] border border-white/10 overflow-hidden relative max-h-[90vh] flex flex-col transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        ref={scrollRef}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white border border-white/10 hover:border-white/30 transition-colors duration-200 bg-black/50 backdrop-blur-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="relative">
            {car.gallery.length > 0 ? (
              <div>
                <div className="relative h-64 md:h-80 overflow-hidden bg-[#0a0a0a]">
                  <div key={activePhoto} className="animate-fade-in relative w-full h-full">
                    <Image
                      src={car.gallery[activePhoto]}
                      alt={`${car.name} photo ${activePhoto + 1}`}
                      fill
                      className="object-contain"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 896px"
                    />
                  </div>
                </div>
                {car.gallery.length > 1 && (
                  <div className="flex gap-2 p-3 bg-[#0d0d0d] border-t border-white/5 overflow-x-auto">
                    {car.gallery.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhoto(i)}
                        className={`relative flex-shrink-0 w-16 h-12 overflow-hidden border transition-all duration-200 ${i === activePhoto ? "border-[#c9a96e]" : "border-white/10 hover:border-white/30"}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`${car.name} thumbnail ${i + 1}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-center bg-[#0a0a0a] pointer-events-none" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 md:h-80 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${car.gradientFrom} 0%, ${car.gradientTo} 100%)` }}>
                <span className="font-display text-6xl font-light opacity-[0.08] tracking-widest" style={{ color: car.accent }}>{car.name}</span>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <h2 className="font-display text-3xl md:text-4xl font-light tracking-wide text-white mb-4">{car.name}</h2>
            <p className="text-white/50 text-sm font-light leading-relaxed mb-6">{car.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#1a1a1a] border border-white/5 p-4 text-center">
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2 font-light">Engine</p>
                <p className="text-white text-sm font-light">{car.engine}</p>
              </div>
              <div className="bg-[#1a1a1a] border border-white/5 p-4 text-center">
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2 font-light">Horsepower</p>
                <p className="text-[#c9a96e] font-display text-lg font-light">{car.hp}</p>
              </div>
              <div className="bg-[#1a1a1a] border border-white/5 p-4 text-center">
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2 font-light">0–100 km/h</p>
                <p className="text-white font-display text-lg font-light">{car.sprint}</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mb-2">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-light mb-3">Select Duration</p>
              <DurationSelector car={car} />
            </div>

            {car.deposit && car.deposit > 0 ? (
              <div className="flex items-center justify-between py-3 border-b border-white/5 mb-6">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-light">Refundable Deposit</span>
                <span className="font-display text-lg font-light text-white/60">${car.deposit.toLocaleString()}</span>
              </div>
            ) : <div className="mb-6" />}

            <button
              onClick={onBook}
              className="w-full bg-[#c9a96e] text-black text-xs tracking-[0.3em] uppercase font-medium py-4 hover:bg-[#e2c898] transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              INQUIRE VIA WHATSAPP
            </button>

            <Link
              href={`/cars/${slugify(car.name)}`}
              className="block text-center text-[10px] text-white/25 hover:text-white/50 tracking-[0.2em] uppercase mt-4 transition-colors duration-200"
            >
              ↗ View full page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
