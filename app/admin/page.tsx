"use client";

import { useEffect, useState, useCallback } from "react";
import { vehicles as staticVehicles, type Vehicle } from "@/lib/data";

const ADMIN_PASSWORD = "1666777";

// ── Helpers ───────────────────────────────────────────────────────────
function formatCurrency(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

// ── Generate data.ts content from vehicles array ──────────────────────
function generateDataTs(vehicles: Vehicle[]): string {
  const vehicleLines = vehicles.map((v) => {
    const imagesStr = v.images
      .map((img) => `{ url: ${JSON.stringify(img.url)}, alt: ${JSON.stringify(img.alt)}, isMain: ${img.isMain} }`)
      .join(", ");
    const badgesStr = v.badges
      .map((b) => `{ name: ${JSON.stringify(b.name)}, label: ${JSON.stringify(b.label)}, icon: ${JSON.stringify(b.icon)} }`)
      .join(", ");
    return `  { id: ${JSON.stringify(v.id)}, slug: ${JSON.stringify(v.slug)}, make: ${JSON.stringify(v.make)}, model: ${JSON.stringify(v.model)}, year: ${v.year}, category: ${JSON.stringify(v.category)}, bodyStyle: ${JSON.stringify(v.bodyStyle)}, tagline: ${JSON.stringify(v.tagline)}, description: ${JSON.stringify(v.description)}, dailyRate: ${v.dailyRate}, weekendRate: ${v.weekendRate ?? 0}, weeklyRate: ${v.weeklyRate ?? 0}, securityDeposit: ${v.securityDeposit}, horsepower: ${v.horsepower}, engine: ${JSON.stringify(v.engine)}, zeroToSixty: ${JSON.stringify(v.zeroToSixty)}, topSpeed: ${JSON.stringify(v.topSpeed)}, transmission: ${JSON.stringify(v.transmission)}, drivetrain: ${JSON.stringify(v.drivetrain)}, seats: ${v.seats}, doors: ${v.doors}, luggage: ${v.luggage}, convertible: ${v.convertible}, available: ${v.available}, featured: ${v.featured}, premierVerified: ${v.premierVerified}, instantConfirm: ${v.instantConfirm}, displayOrder: ${v.displayOrder}, images: [${imagesStr}], badges: [${badgesStr}] },`;
  });

  // Keep faqs and reviews as-is (read from original file)
  const faqsBlock = `export const faqs = [
  { id: "faq-1", question: "What is the minimum age to rent?", answer: "The minimum age to rent most vehicles is 25. Select vehicles may be available to drivers 21+ with additional requirements.", sortOrder: 1 },
  { id: "faq-2", question: "Is a security deposit required?", answer: "Yes, a refundable security deposit is required for all rentals. The amount varies by vehicle and is fully refundable upon safe return.", sortOrder: 2 },
  { id: "faq-3", question: "What documents are required?", answer: "A valid driver's license, proof of insurance, and a major credit card in the renter's name are required.", sortOrder: 3 },
  { id: "faq-4", question: "Is insurance required?", answer: "Yes, valid insurance coverage is required. We can also arrange coverage through our partners if needed.", sortOrder: 4 },
  { id: "faq-5", question: "Is delivery available?", answer: "By default, vehicles are picked up at our Montreal location, detailed and fueled. Delivery is available by special arrangement within Montreal-Dade and Laval County\u2014contact our concierge to coordinate.", sortOrder: 5 },
  { id: "faq-6", question: "Can vehicles be delivered to an airport or hotel?", answer: "Delivery to airports, hotels, residences, and marinas is available by special arrangement and quoted on request. Most customers pick up at our Montreal location for the fastest turnaround.", sortOrder: 6 },
  { id: "faq-7", question: "How much mileage is included?", answer: "Most rentals include 100 miles per day. Additional mileage is available at a per-mile rate.", sortOrder: 7 },
  { id: "faq-8", question: "Can additional drivers be added?", answer: "Yes, additional drivers can be added for a fee. All drivers must meet the same age and documentation requirements.", sortOrder: 8 },
  { id: "faq-9", question: "What is the cancellation policy?", answer: "Full refund with 72+ hours notice. 50% refund with 24-72 hours notice. No refund within 24 hours.", sortOrder: 9 },
  { id: "faq-10", question: "Are same-day reservations available?", answer: "Yes, subject to availability. Contact our concierge team for same-day requests.", sortOrder: 10 },
  { id: "faq-11", question: "How does the verification process work?", answer: "We verify your identity, driving record, and insurance. The process typically takes under 30 minutes.", sortOrder: 11 },
  { id: "faq-12", question: "Are prices displayed with taxes and fees?", answer: "Displayed prices are before taxes and fees. Final pricing is confirmed before reservation.", sortOrder: 12 },
  { id: "faq-13", question: "Can I request a vehicle not currently listed?", answer: "Yes, our concierge team can source specific vehicles through our partner network.", sortOrder: 13 },
];`;

  const reviewsBlock = `export const reviews = [
  { id: "rev-1", rating: 5, title: "Exceptional service", text: "Picked up the Hurac\u00e1n at their Montreal location. Impeccable condition, full tank, and the concierge walked me through everything. Will definitely rent again.", customerLabel: "Montreal Beach", verified: true, rentalDate: "June 2026", vehicle: "Lamborghini Hurac\u00e1n EVO" },
  { id: "rev-2", rating: 5, title: "Worth every penny", text: "Rented the G63 for a weekend in Laurentians. The Urban Kit turns heads everywhere. Pickup was seamless and the car was spotless.", customerLabel: "Old Montreal", verified: true, rentalDate: "June 2026", vehicle: "Mercedes-AMG G63" },
  { id: "rev-3", rating: 5, title: "Best rental experience in Montreal", text: "I've rented from every exotic car company in Montreal. Premier is on another level. The Maybach was flawless and the service was white-glove.", customerLabel: "Westmount", verified: true, rentalDate: "May 2026", vehicle: "Mercedes-Maybach S680" },
  { id: "rev-4", rating: 5, title: "Made our wedding perfect", text: "Rented the Bentley Bentayga for our wedding day. Arrived early, detailed to perfection, and the driver was professional. Made our day unforgettable.", customerLabel: "Plateau Mont-Royal", verified: true, rentalDate: "May 2026", vehicle: "Bentley Bentayga" },
  { id: "rev-5", rating: 4, title: "Great experience overall", text: "The 911 was incredible to drive. Only minor issue was a slight delay at pickup, but the concierge kept me updated throughout.", customerLabel: "Downtown Montreal", verified: true, rentalDate: "April 2026", vehicle: "Porsche 911 4S" },
  { id: "rev-6", rating: 5, title: "The Urus is a beast", text: "Rented the Performante for a photoshoot. Client was blown away. Arranged delivery to the studio and the car was spotless.", customerLabel: " Griffintown", verified: true, rentalDate: "April 2026", vehicle: "Lamborghini Urus Performante" },
];`;

  return `// Static vehicle data - matches the 18-vehicle fleet
// Used for production where Vercel cannot access local SQLite

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  category: string;
  bodyStyle: string;
  tagline: string;
  description: string;
  dailyRate: number;
  weekendRate?: number;
  weeklyRate?: number;
  securityDeposit: number;
  horsepower: number;
  engine: string;
  zeroToSixty: string;
  topSpeed: string;
  transmission: string;
  drivetrain: string;
  seats: number;
  doors: number;
  luggage: number;
  convertible: boolean;
  available: boolean;
  featured: boolean;
  premierVerified: boolean;
  instantConfirm: boolean;
  displayOrder: number;
  images: { url: string; alt: string; isMain: boolean; position?: string }[];
  badges: { name: string; label: string; icon: string }[];
}

export const vehicles: Vehicle[] = [
${vehicleLines.join("\n")}
];

${faqsBlock}

${reviewsBlock}
`;
}

// ── Field Editor ───────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2 text-white text-xs tracking-wide placeholder-white/20 transition-colors";

// ── Vehicle Edit Card ──────────────────────────────────────────────────
function VehicleCard({
  vehicle,
  onChange,
  onDelete,
}: {
  vehicle: Vehicle;
  onChange: (v: Vehicle) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const v = vehicle;

  const update = (field: keyof Vehicle, value: any) => {
    onChange({ ...v, [field]: value });
  };

  return (
    <div className="border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/[0.03] transition-colors" onClick={() => setExpanded(!expanded)}>
        {/* Thumbnail */}
        <div className="w-16 h-12 flex-shrink-0 overflow-hidden bg-black/30">
          {v.images[0]?.url ? (
            <img src={v.images[0].url} alt={v.images[0].alt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10 text-[10px]">No img</div>
          )}
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white font-medium truncate">{v.make} {v.model}</span>
            <span className="text-[9px] text-white/30 tracking-wider">#{v.displayOrder}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-[#c9a96e]">{formatCurrency(v.dailyRate)}/day</span>
            <span className="text-[10px] text-white/30">{v.category}</span>
            {v.available ? (
              <span className="text-[9px] text-green-400 tracking-wider">AVAILABLE</span>
            ) : (
              <span className="text-[9px] text-red-400 tracking-wider">HIDDEN</span>
            )}
            {v.featured && <span className="text-[9px] text-[#c9a96e] tracking-wider">FEATURED</span>}
          </div>
        </div>

        {/* Expand arrow */}
        <span className="text-white/30 text-xs">{expanded ? "−" : "+"}</span>
      </div>

      {/* Expanded form */}
      {expanded && (
        <div className="border-t border-white/10 p-4 flex flex-col gap-4">
          {/* Pricing */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="Daily Rate $">
              <input type="number" className={inputClass} value={v.dailyRate} onChange={(e) => update("dailyRate", parseInt(e.target.value) || 0)} />
            </Field>
            <Field label="Weekend Rate $">
              <input type="number" className={inputClass} value={v.weekendRate ?? 0} onChange={(e) => update("weekendRate", parseInt(e.target.value) || 0)} />
            </Field>
            <Field label="Weekly Rate $">
              <input type="number" className={inputClass} value={v.weeklyRate ?? 0} onChange={(e) => update("weeklyRate", parseInt(e.target.value) || 0)} />
            </Field>
            <Field label="Security Deposit $">
              <input type="number" className={inputClass} value={v.securityDeposit} onChange={(e) => update("securityDeposit", parseInt(e.target.value) || 0)} />
            </Field>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={v.available} onChange={(e) => update("available", e.target.checked)} className="accent-[#c9a96e]" />
              <span className="text-[10px] tracking-widest uppercase text-white/50">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={v.featured} onChange={(e) => update("featured", e.target.checked)} className="accent-[#c9a96e]" />
              <span className="text-[10px] tracking-widest uppercase text-white/50">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={v.premierVerified} onChange={(e) => update("premierVerified", e.target.checked)} className="accent-[#c9a96e]" />
              <span className="text-[10px] tracking-widest uppercase text-white/50">Premier Verified</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={v.instantConfirm} onChange={(e) => update("instantConfirm", e.target.checked)} className="accent-[#c9a96e]" />
              <span className="text-[10px] tracking-widest uppercase text-white/50">Instant Confirm</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={v.convertible} onChange={(e) => update("convertible", e.target.checked)} className="accent-[#c9a96e]" />
              <span className="text-[10px] tracking-widest uppercase text-white/50">Convertible</span>
            </label>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Field label="Make">
              <input className={inputClass} value={v.make} onChange={(e) => update("make", e.target.value)} />
            </Field>
            <Field label="Model">
              <input className={inputClass} value={v.model} onChange={(e) => update("model", e.target.value)} />
            </Field>
            <Field label="Year">
              <input type="number" className={inputClass} value={v.year} onChange={(e) => update("year", parseInt(e.target.value) || 2024)} />
            </Field>
            <Field label="Category">
              <select className={inputClass} value={v.category} onChange={(e) => update("category", e.target.value)}>
                <option value="EXOTIC">EXOTIC</option>
                <option value="LUXURY">LUXURY</option>
                <option value="PERFORMANCE">PERFORMANCE</option>
              </select>
            </Field>
            <Field label="Body Style">
              <select className={inputClass} value={v.bodyStyle} onChange={(e) => update("bodyStyle", e.target.value)}>
                <option value="COUPE">COUPE</option>
                <option value="CONVERTIBLE">CONVERTIBLE</option>
                <option value="SUV">SUV</option>
                <option value="SEDAN">SEDAN</option>
              </select>
            </Field>
            <Field label="Display Order">
              <input type="number" className={inputClass} value={v.displayOrder} onChange={(e) => update("displayOrder", parseInt(e.target.value) || 0)} />
            </Field>
          </div>

          {/* Tagline + Description */}
          <div className="flex flex-col gap-3">
            <Field label="Tagline">
              <input className={inputClass} value={v.tagline} onChange={(e) => update("tagline", e.target.value)} />
            </Field>
            <Field label="Description">
              <textarea className={`${inputClass} min-h-[60px] resize-y`} value={v.description} onChange={(e) => update("description", e.target.value)} />
            </Field>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="Horsepower">
              <input type="number" className={inputClass} value={v.horsepower} onChange={(e) => update("horsepower", parseInt(e.target.value) || 0)} />
            </Field>
            <Field label="Engine">
              <input className={inputClass} value={v.engine} onChange={(e) => update("engine", e.target.value)} />
            </Field>
            <Field label="0-60">
              <input className={inputClass} value={v.zeroToSixty} onChange={(e) => update("zeroToSixty", e.target.value)} />
            </Field>
            <Field label="Top Speed">
              <input className={inputClass} value={v.topSpeed} onChange={(e) => update("topSpeed", e.target.value)} />
            </Field>
            <Field label="Transmission">
              <input className={inputClass} value={v.transmission} onChange={(e) => update("transmission", e.target.value)} />
            </Field>
            <Field label="Drivetrain">
              <input className={inputClass} value={v.drivetrain} onChange={(e) => update("drivetrain", e.target.value)} />
            </Field>
            <Field label="Seats">
              <input type="number" className={inputClass} value={v.seats} onChange={(e) => update("seats", parseInt(e.target.value) || 2)} />
            </Field>
            <Field label="Doors">
              <input type="number" className={inputClass} value={v.doors} onChange={(e) => update("doors", parseInt(e.target.value) || 2)} />
            </Field>
            <Field label="Luggage">
              <input type="number" className={inputClass} value={v.luggage} onChange={(e) => update("luggage", parseInt(e.target.value) || 1)} />
            </Field>
          </div>

          {/* Images */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setShowImages(!showImages)}
              className="text-[10px] tracking-widest uppercase text-[#c9a96e] hover:text-[#c9a96e]/80 transition-colors text-left"
            >
              {showImages ? "− Hide" : "+ Show"} Images ({v.images.length})
            </button>
            {showImages && (
              <div className="flex flex-col gap-2">
                {v.images.map((img, i) => (
                  <div key={i} className="flex items-center gap-2 bg-black/30 p-2 border border-white/5">
                    <div className="w-14 h-10 flex-shrink-0 overflow-hidden bg-black/40">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        className={`${inputClass} w-full mb-1`}
                        value={img.url}
                        onChange={(e) => {
                          const newImages = [...v.images];
                          newImages[i] = { ...img, url: e.target.value };
                          update("images", newImages);
                        }}
                      />
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={img.isMain}
                        onChange={(e) => {
                          const newImages = v.images.map((im, idx) => ({ ...im, isMain: idx === i }));
                          update("images", newImages);
                        }}
                        className="accent-[#c9a96e]"
                      />
                      <span className="text-[9px] tracking-wider text-white/40">MAIN</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => update("images", v.images.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-400 text-xs px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => update("images", [...v.images, { url: "", alt: `${v.make} ${v.model}`, isMain: v.images.length === 0 }])}
                  className="text-[10px] tracking-widest uppercase text-white/40 hover:text-white/60 border border-white/10 hover:border-white/20 px-3 py-1.5 transition-colors w-fit"
                >
                  + Add Image
                </button>
              </div>
            )}
          </div>

          {/* Delete */}
          <div className="flex justify-end pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onDelete}
              className="text-[10px] tracking-widest uppercase text-red-500/60 hover:text-red-400 transition-colors"
            >
              Delete Vehicle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Load vehicles on auth
  useEffect(() => {
    if (authed) {
      // Use static import (already available client-side)
      setVehicles(JSON.parse(JSON.stringify(staticVehicles)));
    }
  }, [authed]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      alert("Wrong password");
    }
  };

  const updateVehicle = (index: number, v: Vehicle) => {
    const next = [...vehicles];
    next[index] = v;
    setVehicles(next);
  };

  const deleteVehicle = (index: number) => {
    if (!confirm(`Delete ${vehicles[index].make} ${vehicles[index].model}?`)) return;
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

  const addVehicle = () => {
    const newId = String(Math.max(0, ...vehicles.map((v) => parseInt(v.id))) + 1);
    const newVehicle: Vehicle = {
      id: newId,
      slug: `new-vehicle-${newId}`,
      make: "New",
      model: "Vehicle",
      year: 2024,
      category: "EXOTIC",
      bodyStyle: "COUPE",
      tagline: "",
      description: "",
      dailyRate: 500,
      weekendRate: 550,
      weeklyRate: 450,
      securityDeposit: 1000,
      horsepower: 0,
      engine: "",
      zeroToSixty: "",
      topSpeed: "",
      transmission: "Automatic",
      drivetrain: "AWD",
      seats: 2,
      doors: 2,
      luggage: 1,
      convertible: false,
      available: true,
      featured: false,
      premierVerified: true,
      instantConfirm: true,
      displayOrder: Math.max(0, ...vehicles.map((v) => v.displayOrder)) + 1,
      images: [],
      badges: [{ name: "verified", label: "Verified", icon: "shield-check" }],
    };
    setVehicles([...vehicles, newVehicle]);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const content = generateDataTs(vehicles);
      const res = await fetch("/api/admin/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: ADMIN_PASSWORD, content }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg(`Saved! Commit: ${data.commit.slice(0, 7)}. Vercel deploying...`);
      } else {
        setSaveMsg(`Error: ${data.error || "Unknown"}`);
      }
    } catch (err) {
      setSaveMsg(`Error: ${(err as Error).message}`);
    }
    setSaving(false);
  };

  const filtered = vehicles.filter((v) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
  });

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <h1 className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] text-center">Admin Dashboard</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-4 py-3 text-white text-sm text-center tracking-widest"
            autoFocus
          />
          <button
            onClick={handleLogin}
            className="bg-[#c9a96e] text-black text-xs tracking-widest uppercase font-medium py-3 hover:bg-[#c9a96e]/80 transition-colors"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]">Fleet Admin</h1>
          <span className="text-[10px] text-white/30">{vehicles.length} vehicles</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-1.5 text-white text-xs w-32 sm:w-48"
          />
          <button
            onClick={addVehicle}
            className="text-[10px] tracking-widest uppercase border border-white/10 hover:border-[#c9a96e]/40 text-white/60 hover:text-[#c9a96e] px-3 py-1.5 transition-colors"
          >
            + Add
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#c9a96e] text-black text-[10px] tracking-widest uppercase font-medium px-4 py-1.5 hover:bg-[#c9a96e]/80 transition-colors disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {/* Save message */}
      {saveMsg && (
        <div className="px-4 py-2 bg-[#c9a96e]/10 border-b border-[#c9a96e]/20">
          <p className="text-[10px] tracking-wider text-[#c9a96e]">{saveMsg}</p>
        </div>
      )}

      {/* Vehicle list */}
      <div className="max-w-5xl mx-auto p-4 flex flex-col gap-2">
        {filtered.map((v, i) => {
          const originalIndex = vehicles.indexOf(v);
          return (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onChange={(nv) => updateVehicle(originalIndex, nv)}
              onDelete={() => deleteVehicle(originalIndex)}
            />
          );
        })}
      </div>
    </div>
  );
}