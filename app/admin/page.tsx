"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { DayPicker } from "react-day-picker";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  parseISO,
  isWithinInterval,
} from "date-fns";
import "react-day-picker/dist/style.css";
import ImagePositionPicker from "@/components/admin/ImagePositionPicker";

const CARS = [
  "Audi RS7",
  "Audi RS6",
  "BMW M5 Competition",
  "Audi R8",
  "McLaren 600LT",
  "Lamborghini Urus",
  "Mercedes G63 AMG",
];

const CAR_COLORS: Record<string, string> = {
  "Audi RS7": "bg-blue-600 text-white",
  "Audi RS6": "bg-purple-600 text-white",
  "BMW M5 Competition": "bg-orange-500 text-white",
  "Audi R8": "bg-white text-black",
  "McLaren 600LT": "bg-red-600 text-white",
  "Lamborghini Urus": "bg-yellow-400 text-black",
  "Mercedes G63 AMG": "bg-green-600 text-white",
};

const CAR_SHORT: Record<string, string> = {
  "Audi RS7": "RS7",
  "Audi RS6": "RS6",
  "BMW M5 Competition": "M5",
  "Audi R8": "R8",
  "McLaren 600LT": "600LT",
  "Lamborghini Urus": "Urus",
  "Mercedes G63 AMG": "G63",
};

const PASSWORD = "1666777";

// ── Fleet Types ────────────────────────────────────────────────────────
interface FleetCar {
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
  coming_soon: boolean;
  sort_order: number;
  deposit: number | null;
  image_position: string | null;
  rate_3d: number | null;
  rate_7d: number | null;
  rate_14d: number | null;
  rate_30d: number | null;
}

const EMPTY_FLEET_FORM = {
  name: "",
  nickname: "",
  rate: "",
  original_rate: "",
  engine: "",
  hp: "",
  sprint: "",
  specs: "",
  deposit: "",
  image_position: "",
  description: "",
  image: "",
  gallery: [] as string[],
  coming_soon: false,
  sort_order: "0",
  rate_3d: "",
  rate_7d: "",
  rate_14d: "",
  rate_30d: "",
};

interface Booking {
  id: number;
  car_name: string;
  client_name: string;
  client_phone: string | null;
  pickup_date: string;
  return_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  deposit_status: string | null;
  payment_status: string | null;
  total_price: number | null;
  drop_off_location: string | null;
  referral: string | null;
}

// ── Date Picker Component ──────────────────────────────────────────────
function DatePickerInput({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
  label: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1 relative" ref={ref}>
      <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">
        {label}
      </label>
      <input
        type="text"
        readOnly
        value={value ? format(value, "MMM d, yyyy") : ""}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        placeholder={placeholder ?? "Select date"}
        className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors cursor-pointer"
      />
      {open && (
        <>
          {/* Mobile: fullscreen modal. Desktop: dropdown popover */}
          <div
            className="fixed inset-0 z-40 bg-black/70 sm:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-[#1a1a1a] border-t border-white/10 shadow-2xl p-4 sm:absolute sm:inset-auto sm:top-full sm:bottom-auto sm:mt-1 sm:p-0 sm:border sm:border-white/10">
            <div className="flex items-center justify-between mb-3 sm:hidden">
              <span className="text-[10px] tracking-widest uppercase text-white/40">{label}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-white/60 hover:text-white text-lg px-2"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <style>{`
              .rdp { --rdp-accent-color: #c9a96e; --rdp-background-color: #c9a96e22; color: #fff; margin: 0; }
              .rdp-day_selected { background: #c9a96e !important; color: #000 !important; }
              .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background: rgba(255,255,255,0.08); }
              .rdp-head_cell { color: rgba(255,255,255,0.3); font-size: 10px; }
              .rdp-caption_label { color: #fff; font-size: 13px; }
              .rdp-nav_button { color: rgba(255,255,255,0.5); }
              .rdp-day { color: rgba(255,255,255,0.7); }
              .rdp-day_outside { color: rgba(255,255,255,0.15); }
              @media (max-width: 639px) {
                .rdp { font-size: 14px; }
                .rdp-day, .rdp-button { width: 40px !important; height: 40px !important; }
                .rdp-table { width: 100% !important; max-width: 100% !important; }
              }
            `}</style>
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(d) => {
                onChange(d);
                setOpen(false);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────
function Badge({ label, variant }: { label: string; variant?: string }) {
  const v = (variant ?? label).toLowerCase();
  const colors: Record<string, string> = {
    confirmed: "bg-green-900/60 text-green-400 border-green-700/40",
    pending: "bg-yellow-900/60 text-yellow-400 border-yellow-700/40",
    cancelled: "bg-red-900/60 text-red-400 border-red-700/40",
    paid: "bg-green-900/60 text-green-400 border-green-700/40",
    partial: "bg-blue-900/60 text-blue-400 border-blue-700/40",
    waived: "bg-purple-900/60 text-purple-400 border-purple-700/40",
  };
  return (
    <span
      className={`text-[10px] tracking-wider uppercase px-2 py-1 border rounded-sm font-light ${
        colors[v] ?? "bg-white/5 text-white/40 border-white/10"
      }`}
    >
      {label}
    </span>
  );
}

// ── Calendar ───────────────────────────────────────────────────────────
function BookingsCalendar({ bookings, onSelectBooking }: { bookings: Booking[]; onSelectBooking: (booking: Booking) => void }) {
  const [month, setMonth] = useState(new Date());

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start
  const startPad = getDay(monthStart); // 0=Sun
  const grid: (Date | null)[] = [
    ...Array(startPad).fill(null),
    ...days,
  ];

  function getBookingsForDay(day: Date) {
    return bookings.filter((b) => {
      const pickup = parseISO(b.pickup_date);
      const ret = parseISO(b.return_date);
      return isWithinInterval(day, { start: pickup, end: ret });
    });
  }

  return (
    <div className="border border-white/5 bg-white/[0.02] p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] font-light">
          Booking Calendar
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMonth((m) => subMonths(m, 1))}
            className="text-white/40 hover:text-white/80 transition-colors text-sm px-2"
          >
            ‹
          </button>
          <span className="text-white/70 text-xs tracking-widest uppercase">
            {format(month, "MMMM yyyy")}
          </span>
          <button
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="text-white/40 hover:text-white/80 transition-colors text-sm px-2"
          >
            ›
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-[9px] md:text-[11px] tracking-widest uppercase text-white/30 py-3"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-px bg-white/5">
        {grid.map((day, i) => {
          if (!day) {
            return <div key={`pad-${i}`} className="bg-[#080808] min-h-[70px] md:min-h-[110px]" />;
          }
          const dayBookings = getBookingsForDay(day);
          const today = isToday(day);
          const inMonth = isSameMonth(day, month);
          return (
            <div
              key={day.toISOString()}
              className={`bg-[#0d0d0d] min-h-[70px] md:min-h-[130px] p-2 flex flex-col ${
                today ? "ring-1 ring-[#c9a96e]/40 ring-inset" : ""
              } ${!inMonth ? "opacity-30" : ""}`}
            >
              <span
                className={`text-[13px] mb-1.5 font-medium ${
                  today ? "text-[#c9a96e]" : "text-white/30"
                }`}
              >
                {format(day, "d")}
              </span>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {dayBookings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onSelectBooking(b)}
                    className={`text-[9px] md:text-[11px] px-1.5 py-0.5 rounded truncate font-medium leading-tight text-left w-full cursor-pointer hover:opacity-80 transition-opacity ${
                      CAR_COLORS[b.car_name] ?? "bg-white/10 text-white"
                    }`}
                    title={`${b.car_name} — ${b.client_name}`}
                  >
                    {CAR_SHORT[b.car_name] ?? b.car_name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-4">
        {CARS.map((car) => (
          <span
            key={car}
            className={`text-[9px] px-2 py-0.5 rounded font-medium ${CAR_COLORS[car]}`}
          >
            {CAR_SHORT[car]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Gallery Manager Component ─────────────────────────────────────────
function GalleryManager({
  gallery,
  onChange,
}: {
  gallery: string[];
  onChange: (g: string[]) => void;
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [availablePhotos, setAvailablePhotos] = useState<{path: string; filename: string}[]>([]);

  const refetchPhotos = useCallback(() => {
    fetch('/api/photos', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setAvailablePhotos(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refetchPhotos();
    const handler = () => refetchPhotos();
    window.addEventListener('photos:updated', handler);
    return () => window.removeEventListener('photos:updated', handler);
  }, [refetchPhotos]);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    const errors: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/photos/upload',
        });
        uploaded.push(blob.url);
      } catch (err) {
        console.error('upload failed', file.name, err);
        errors.push(`${file.name}: ${(err as Error).message || 'unknown'}`);
      }
    }
    setUploading(false);
    if (uploaded.length) {
      onChange([...gallery, ...uploaded.filter(p => !gallery.includes(p))]);
      window.dispatchEvent(new Event('photos:updated'));
      refetchPhotos();
    }
    if (errors.length) alert('Upload failed:\n' + errors.join('\n'));
  }

  function removeImage(path: string) {
    onChange(gallery.filter((p) => p !== path));
  }

  function addImage(path: string) {
    if (!path || gallery.includes(path)) return;
    onChange([...gallery, path]);
  }

  function handleDragStart(i: number) { setDragIdx(i); }
  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    const next = [...gallery];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    setDragIdx(i);
    onChange(next);
  }
  function handleDragEnd() { setDragIdx(null); }

  return (
    <div className="flex flex-col gap-3">
      {/* Current gallery thumbnails — draggable */}
      {gallery.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {gallery.map((path, i) => (
            <div
              key={path}
              className={`relative group cursor-grab active:cursor-grabbing ${
                dragIdx === i ? "opacity-50 ring-1 ring-[#c9a96e]" : ""
              }`}
              style={{ width: 140, height: 105 }}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
            >
              <img
                src={path}
                alt=""
                className="w-full h-full object-cover border border-white/10 pointer-events-none"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }}
              />
              {i === 0 && (
                <span className="absolute top-0.5 left-0.5 bg-[#c9a96e] text-black text-[7px] px-1 font-bold">MAIN</span>
              )}
              <button
                type="button"
                onClick={() => removeImage(path)}
                className="absolute top-0.5 right-0.5 bg-red-600 hover:bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] leading-none transition-colors"
                title="Remove"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-[8px] text-white/50 px-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {i + 1} · drag to reorder
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-white/20 tracking-wider">No images in gallery</p>
      )}

      {/* Upload photos shortcut */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => uploadRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 border border-white/10 hover:border-[#c9a96e]/40 text-white/40 hover:text-[#c9a96e] text-[10px] tracking-[0.2em] uppercase px-3 py-2 transition-colors disabled:opacity-40"
        >
          {uploading ? '↑ Uploading...' : '↑ Upload Photos'}
        </button>
        <span className="text-[9px] text-white/20">Select multiple files — auto-added to gallery</span>
        <input ref={uploadRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden"
          onChange={(e) => handleUpload(e.target.files)} />
      </div>

      {/* All images picker strip — sourced from /api/photos (same as main Photo Library) */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[9px] tracking-widest uppercase text-white/25">All available photos — click to add/remove</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
          {availablePhotos.length === 0 && (
            <p className="text-[10px] text-white/20 tracking-wider">Loading…</p>
          )}
          {availablePhotos.map((photo) => {
            const active = gallery.includes(photo.path);
            return (
              <div key={photo.path} onClick={() => {
                  if (active) onChange(gallery.filter(p => p !== photo.path));
                  else addImage(photo.path);
                }}
                className="relative flex-shrink-0 cursor-pointer" style={{ width: 100, height: 75 }} title={photo.filename}>
                <img src={photo.path} alt={photo.filename}
                  className={`w-full h-full object-cover transition-all ${
                    active ? "border-2 border-[#c9a96e]" : "border border-white/10 opacity-50 hover:opacity-80"
                  }`}
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.1"; }}
                />
                {active && <div className="absolute inset-0 flex items-center justify-center"><span className="text-[#c9a96e] text-[14px] drop-shadow">✓</span></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Photo Library Component ──────────────────────────────────────────
function PhotoLibrary() {
  const [photos, setPhotos] = useState<{ path: string; filename: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/photos', { cache: 'no-store' });
      const data = await res.json();
      setPhotos(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
    const handler = () => fetchPhotos();
    window.addEventListener('photos:updated', handler);
    return () => window.removeEventListener('photos:updated', handler);
  }, [fetchPhotos]);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/photos/upload',
      });
      await fetchPhotos();
      window.dispatchEvent(new Event('photos:updated'));
    } catch (err) {
      console.error('upload failed', err);
      alert('Upload failed: ' + ((err as Error).message || 'unknown'));
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  async function copyPath(p: string) {
    try {
      await navigator.clipboard.writeText(p);
      setCopiedPath(p);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch {
      // ignore
    }
  }

  async function deletePhoto(p: string) {
    if (!confirm('Delete this photo?')) return;
    setDeletingPath(p);
    try {
      const res = await fetch('/api/photos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: p }),
      });
      if (!res.ok) throw new Error('Delete failed');
      await fetchPhotos();
      window.dispatchEvent(new Event('photos:updated'));
    } catch {
      alert('Failed to delete photo.');
    } finally {
      setDeletingPath(null);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] font-light">
        Photo Library ({photos.length} photos)
      </h2>

      {/* Upload zone */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-sm flex flex-col items-center justify-center py-10 cursor-pointer transition-colors ${
          dragOver ? 'border-[#c9a96e]/60 bg-[#c9a96e]/5' : 'border-white/10 hover:border-white/20'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
            <p className="text-[11px] text-white/40 tracking-wider">Uploading...</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-white/40 tracking-wide">Drop photos here or click to browse</p>
            <p className="text-[10px] text-white/20 tracking-widest uppercase mt-1">.jpg · .png · .webp</p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Photo grid */}
      {loading ? (
        <p className="text-white/30 text-xs tracking-wider">Loading photos...</p>
      ) : photos.length === 0 ? (
        <p className="text-white/20 text-xs tracking-wider">No photos found.</p>
      ) : (
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
          {photos.map((photo) => (
            <div
              key={photo.path}
              onClick={() => copyPath(photo.path)}
              className="cursor-pointer group flex flex-col items-center gap-1"
            >
              <div className="relative w-full" style={{ height: 90 }}>
                <img
                  src={photo.path}
                  alt={photo.filename}
                  className="w-full h-full object-cover border border-white/10 group-hover:border-[#c9a96e]/40 transition-colors"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.15'; }}
                />
                {copiedPath === photo.path && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-[#c9a96e] text-xs tracking-widest">✓ Copied!</span>
                  </div>
                )}
                {photo.path.startsWith('https://') && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deletePhoto(photo.path); }}
                    disabled={deletingPath === photo.path}
                    className="absolute top-0.5 right-0.5 bg-red-600 hover:bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] leading-none transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-60"
                    title="Delete photo"
                  >
                    {deletingPath === photo.path ? '…' : '✕'}
                  </button>
                )}
              </div>
              <p className="text-[9px] text-white/30 truncate w-full text-center px-1">
                {photo.filename}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Fleet Management Component ────────────────────────────────────────
function FleetManagement() {
  const [fleet, setFleet] = useState<FleetCar[]>([]);
  const [fleetLoading, setFleetLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<FleetCar | null>(null);
  const [fleetForm, setFleetForm] = useState<typeof EMPTY_FLEET_FORM>(EMPTY_FLEET_FORM);
  const [fleetSubmitting, setFleetSubmitting] = useState(false);
  const [fleetError, setFleetError] = useState("");
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [reorderToast, setReorderToast] = useState(false);

  const fetchFleet = useCallback(async () => {
    setFleetLoading(true);
    try {
      const res = await fetch("/api/fleet");
      const data = await res.json();
      setFleet(data);
    } catch {
      // ignore
    } finally {
      setFleetLoading(false);
    }
  }, []);

  useEffect(() => { fetchFleet(); }, [fetchFleet]);

  function openAddForm() {
    setEditingCar(null);
    setFleetForm(EMPTY_FLEET_FORM);
    setFleetError("");
    setShowForm(true);
  }

  function openEditForm(car: FleetCar) {
    setEditingCar(car);
    setFleetForm({
      name: car.name,
      nickname: car.nickname ?? "",
      rate: String(car.rate),
      original_rate: car.original_rate != null ? String(car.original_rate) : "",
      engine: car.engine ?? "",
      hp: car.hp ?? "",
      sprint: car.sprint ?? "",
      specs: car.specs ?? "",
      deposit: car.deposit != null ? String(car.deposit) : "",
      image_position: car.image_position ?? "",
      description: car.description ?? "",
      image: car.image ?? "",
      gallery: Array.isArray(car.gallery) ? car.gallery : [],
      coming_soon: car.coming_soon,
      sort_order: String(car.sort_order),
      rate_3d: car.rate_3d != null ? String(car.rate_3d) : "",
      rate_7d: car.rate_7d != null ? String(car.rate_7d) : "",
      rate_14d: car.rate_14d != null ? String(car.rate_14d) : "",
      rate_30d: car.rate_30d != null ? String(car.rate_30d) : "",
    });
    setFleetError("");
    setShowForm(true);
  }

  async function handleFleetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFleetError("");
    if (!fleetForm.name || !fleetForm.rate) {
      setFleetError("Name and rate are required.");
      return;
    }
    setFleetSubmitting(true);
    try {
      const galleryArr = fleetForm.gallery;
      const payload = {
        name: fleetForm.name,
        nickname: fleetForm.nickname || null,
        rate: parseInt(fleetForm.rate, 10),
        original_rate: fleetForm.original_rate ? parseInt(fleetForm.original_rate, 10) : null,
        engine: fleetForm.engine || null,
        hp: fleetForm.hp || null,
        sprint: fleetForm.sprint || null,
        specs: fleetForm.specs || null,
        deposit: fleetForm.deposit ? parseInt(fleetForm.deposit, 10) : 0,
        image_position: fleetForm.image_position.trim() || null,
        description: fleetForm.description || null,
        image: fleetForm.gallery[0] || null,
        gallery: galleryArr,
        coming_soon: fleetForm.coming_soon,
        sort_order: parseInt(fleetForm.sort_order, 10) || 0,
        rate_3d: fleetForm.rate_3d ? parseInt(fleetForm.rate_3d, 10) : null,
        rate_7d: fleetForm.rate_7d ? parseInt(fleetForm.rate_7d, 10) : null,
        rate_14d: fleetForm.rate_14d ? parseInt(fleetForm.rate_14d, 10) : null,
        rate_30d: fleetForm.rate_30d ? parseInt(fleetForm.rate_30d, 10) : null,
      };

      if (editingCar) {
        const res = await fetch(`/api/fleet/${editingCar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed");
      } else {
        const res = await fetch("/api/fleet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed");
      }

      setShowForm(false);
      setEditingCar(null);
      await fetchFleet();
    } catch {
      setFleetError("Failed to save. Try again.");
    } finally {
      setFleetSubmitting(false);
    }
  }

  async function handleDeleteCar(id: number) {
    if (!confirm("Delete this car from the fleet?")) return;
    await fetch(`/api/fleet/${id}`, { method: "DELETE" });
    await fetchFleet();
  }

  const inputCls = "bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors";
  const labelCls = "text-[9px] tracking-widest uppercase text-white/30 font-light";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] font-light">
          Fleet ({fleet.length} cars)
        </h2>
        <button
          onClick={openAddForm}
          className="bg-[#c9a96e] text-black text-[10px] tracking-[0.3em] uppercase font-medium px-4 py-2.5 hover:bg-[#e2c898] transition-colors"
        >
          + Add New Car
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="border border-[#c9a96e]/20 bg-white/[0.02] p-6">
          <h3 className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] font-semibold mb-5">
            {editingCar ? `✎ Editing: ${editingCar.name}` : "✦ New Car"}
          </h3>
          <form onSubmit={handleFleetSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Name *</label>
              <input type="text" value={fleetForm.name}
                onChange={(e) => setFleetForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Audi RS7" className={inputCls} />
            </div>

            {/* Rate */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Rate ($/day) *</label>
              <input type="number" min="0" value={fleetForm.rate}
                onChange={(e) => setFleetForm(f => ({ ...f, rate: e.target.value }))}
                placeholder="599" className={inputCls} />
            </div>

            {/* Original Rate */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Original Rate (optional)</label>
              <input type="number" min="0" value={fleetForm.original_rate}
                onChange={(e) => setFleetForm(f => ({ ...f, original_rate: e.target.value }))}
                placeholder="Strikethrough price" className={inputCls} />
            </div>

            {/* Engine */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Engine</label>
              <input type="text" value={fleetForm.engine}
                onChange={(e) => setFleetForm(f => ({ ...f, engine: e.target.value }))}
                placeholder="4.0L V8 Biturbo" className={inputCls} />
            </div>

            {/* HP */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Horsepower</label>
              <input type="text" value={fleetForm.hp}
                onChange={(e) => setFleetForm(f => ({ ...f, hp: e.target.value }))}
                placeholder="591 hp" className={inputCls} />
            </div>

            {/* Sprint */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>0–100 km/h</label>
              <input type="text" value={fleetForm.sprint}
                onChange={(e) => setFleetForm(f => ({ ...f, sprint: e.target.value }))}
                placeholder="3.6s" className={inputCls} />
            </div>

            {/* Quick Specs (card overlay) */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Quick Specs (card overlay)</label>
              <input type="text" value={fleetForm.specs}
                onChange={(e) => setFleetForm(f => ({ ...f, specs: e.target.value }))}
                placeholder="617 hp · V8 Twin-Turbo · xDrive" className={inputCls} />
              <p className="text-[9px] text-white/20 tracking-wide">Shown at the bottom of the fleet card image</p>
            </div>

            {/* Deposit */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Security Deposit ($)</label>
              <input type="number" value={fleetForm.deposit}
                onChange={(e) => setFleetForm(f => ({ ...f, deposit: e.target.value }))}
                placeholder="5000" className={inputCls} />
            </div>

            {/* Multi-day Rates */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>3-Day Rate ($/day)</label>
              <input type="number" min="0" value={fleetForm.rate_3d}
                onChange={(e) => setFleetForm(f => ({ ...f, rate_3d: e.target.value }))}
                placeholder="Discounted /day for 3 days" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>7-Day Rate ($/day)</label>
              <input type="number" min="0" value={fleetForm.rate_7d}
                onChange={(e) => setFleetForm(f => ({ ...f, rate_7d: e.target.value }))}
                placeholder="Discounted /day for 7 days" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>14-Day Rate ($/day)</label>
              <input type="number" min="0" value={fleetForm.rate_14d}
                onChange={(e) => setFleetForm(f => ({ ...f, rate_14d: e.target.value }))}
                placeholder="Discounted /day for 14 days" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>30-Day Rate ($/day)</label>
              <input type="number" min="0" value={fleetForm.rate_30d}
                onChange={(e) => setFleetForm(f => ({ ...f, rate_30d: e.target.value }))}
                placeholder="Discounted /day for 30 days" className={inputCls} />
            </div>

            {/* Image Position (CSS object-position) */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Image Position</label>
              <ImagePositionPicker
                imageSrc={fleetForm.gallery[0] || fleetForm.image || null}
                value={fleetForm.image_position}
                onChange={(v) => setFleetForm(f => ({ ...f, image_position: v }))}
              />
              <span className="text-[10px] text-white/40">Drag the dot to set the focal point</span>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1 col-span-full">
              <label className={labelCls}>Description</label>
              <textarea value={fleetForm.description}
                onChange={(e) => setFleetForm(f => ({ ...f, description: e.target.value }))}
                rows={2} placeholder="Car description..."
                className={`${inputCls} resize-none`} />
            </div>

            {/* Gallery */}
            <div className="flex flex-col gap-1 col-span-full">
              <label className={labelCls}>Gallery Images</label>
              <GalleryManager
                gallery={fleetForm.gallery}
                onChange={(g) => setFleetForm(f => ({ ...f, gallery: g }))}
              />
            </div>

            {/* Coming Soon */}
            <div className="flex items-center gap-3 col-span-full">
              <input
                type="checkbox"
                id="coming_soon"
                checked={fleetForm.coming_soon}
                onChange={(e) => setFleetForm(f => ({ ...f, coming_soon: e.target.checked }))}
                className="w-4 h-4 accent-[#c9a96e]"
              />
              <label htmlFor="coming_soon" className="text-xs text-white/50 tracking-wide cursor-pointer">
                Mark as Coming Soon (hides image, shows placeholder)
              </label>
            </div>

            {fleetError && (
              <p className="col-span-full text-red-400 text-[11px] tracking-wider">{fleetError}</p>
            )}

            {/* Actions */}
            <div className="col-span-full flex gap-3">
              <button type="button" onClick={() => { setShowForm(false); setEditingCar(null); }}
                className="border border-white/10 text-white/40 text-[10px] tracking-widest uppercase px-5 py-2.5 hover:text-white/60 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={fleetSubmitting}
                className="border border-[#c9a96e]/40 hover:border-[#c9a96e] text-[#c9a96e] text-[10px] tracking-[0.2em] uppercase px-6 py-2.5 font-light transition-all duration-300 disabled:opacity-40">
                {fleetSubmitting ? "Saving..." : editingCar ? "Save Changes" : "Add Car"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reorder saved toast */}
      {reorderToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1a1a] border border-[#c9a96e]/40 text-[#c9a96e] text-[11px] tracking-widest uppercase px-5 py-3 shadow-xl">
          ✓ Reorder saved
        </div>
      )}

      {/* Fleet List */}
      {fleetLoading ? (
        <p className="text-white/30 text-xs tracking-wider">Loading fleet...</p>
      ) : fleet.length === 0 ? (
        <p className="text-white/20 text-xs tracking-wider">No cars in fleet yet.</p>
      ) : (
        <div className="border border-white/5 overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0">
          <table className="min-w-[700px] w-full text-xs font-light">
            <thead>
              <tr className="border-b border-white/5">
                {["", "#", "Name", "Rate", "Engine", "HP", "Sprint", "Status", ""].map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 text-[9px] tracking-[0.3em] uppercase text-white/25 font-light whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fleet.map((car) => (
                <tr
                  key={car.id}
                  draggable
                  onDragStart={() => setDraggedId(car.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async () => {
                    if (draggedId === null || draggedId === car.id) return;
                    const from = fleet.findIndex((c) => c.id === draggedId);
                    const to = fleet.findIndex((c) => c.id === car.id);
                    if (from === -1 || to === -1) return;
                    const reordered = [...fleet];
                    const [moved] = reordered.splice(from, 1);
                    reordered.splice(to, 0, moved);
                    const withOrder = reordered.map((c, i) => ({ ...c, sort_order: i }));
                    setFleet(withOrder);
                    setDraggedId(null);
                    try {
                      await fetch('/api/fleet/sort-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ order: withOrder.map((c) => ({ id: c.id, sort_order: c.sort_order })) }),
                      });
                      setReorderToast(true);
                      setTimeout(() => setReorderToast(false), 2000);
                    } catch {
                      // ignore
                    }
                  }}
                  className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                    draggedId === car.id ? 'opacity-40' : ''
                  }`}
                >
                  <td className="px-2 py-3 text-white/20 cursor-grab select-none text-base" title="Drag to reorder">⠿</td>
                  <td className="px-4 py-3 text-white/30">{car.sort_order}</td>
                  <td className="px-4 py-3 text-white/80 tracking-wide whitespace-nowrap font-medium">{car.name}</td>
                  <td className="px-4 py-3 text-[#c9a96e] whitespace-nowrap">
                    ${car.rate.toLocaleString()}/day
                    {car.original_rate && (
                      <span className="ml-1 text-white/20 line-through">${car.original_rate}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/40 whitespace-nowrap">{car.engine ?? "—"}</td>
                  <td className="px-4 py-3 text-white/40 whitespace-nowrap">{car.hp ?? "—"}</td>
                  <td className="px-4 py-3 text-white/40 whitespace-nowrap">{car.sprint ?? "—"}</td>
                  <td className="px-4 py-3">
                    {car.coming_soon ? (
                      <span className="text-[10px] tracking-wider uppercase px-2 py-1 bg-yellow-900/40 text-yellow-400 border border-yellow-700/30">Soon</span>
                    ) : (
                      <span className="text-[10px] tracking-wider uppercase px-2 py-1 bg-emerald-900/40 text-emerald-400 border border-emerald-700/30">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEditForm(car)}
                        className="text-[9px] tracking-wider uppercase text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteCar(car.id)}
                        className="text-[9px] tracking-wider uppercase text-red-500/50 hover:text-red-400 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "fleet" | "photos">("bookings");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState(false);
  const [editForm, setEditForm] = useState<{
    car_name: string;
    client_name: string;
    client_phone: string;
    deposit_status: string;
    payment_status: string;
    total_price: string;
    drop_off_location: string;
    notes: string;
    referral: string;
    status: string;
  } | null>(null);
  const [editPickupDate, setEditPickupDate] = useState<Date | undefined>();
  const [editReturnDate, setEditReturnDate] = useState<Date | undefined>();
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");
  const addBookingRef = useRef<HTMLDivElement>(null);

  const [fleetCars, setFleetCars] = useState<string[]>([]);

  // Form state
  const [form, setForm] = useState({
    car_name: "",
    client_name: "",
    client_phone: "",
    deposit_status: "pending",
    payment_status: "pending",
    total_price: "",
    drop_off_location: "",
    notes: "",
    referral: "",
    status: "confirmed",
  });
  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("wh_admin") === "1") setAuthed(true);
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchBookings();
  }, [authed, fetchBookings]);

  useEffect(() => {
    if (authed) {
      fetch('/api/fleet')
        .then(r => r.json())
        .then((data: Array<{name: string, sort_order: number}>) => {
          const names = data
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(c => c.name);
          setFleetCars(names);
        })
        .catch(() => setFleetCars(CARS));
    }
  }, [authed]);

  useEffect(() => {
    if (fleetCars.length > 0 && !form.car_name) {
      setForm(prev => ({ ...prev, car_name: fleetCars[0] }));
    }
  }, [fleetCars]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pw === PASSWORD) {
      sessionStorage.setItem("wh_admin", "1");
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  async function handleAddBooking(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.client_name || !pickupDate || !returnDate) {
      setFormError("Client name, pickup and return dates are required.");
      return;
    }
    if (returnDate <= pickupDate) {
      setFormError("Return date must be after pickup date.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        pickup_date: format(pickupDate, "yyyy-MM-dd"),
        return_date: format(returnDate, "yyyy-MM-dd"),
        total_price: form.total_price ? parseFloat(form.total_price) : null,
      };
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      setForm({
        car_name: fleetCars[0] ?? CARS[0],
        client_name: "",
        client_phone: "",
        deposit_status: "pending",
        payment_status: "pending",
        total_price: "",
        drop_off_location: "",
        notes: "",
        referral: "",
        status: "confirmed",
      });
      setPickupDate(undefined);
      setReturnDate(undefined);
      await fetchBookings();
    } catch {
      setFormError("Failed to add booking. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    await fetchBookings();
  }

  function openEditMode(booking: Booking) {
    setEditForm({
      car_name: booking.car_name,
      client_name: booking.client_name,
      client_phone: booking.client_phone ?? "",
      deposit_status: booking.deposit_status ?? "pending",
      payment_status: booking.payment_status ?? "pending",
      total_price: booking.total_price != null ? String(booking.total_price) : "",
      drop_off_location: booking.drop_off_location ?? "",
      notes: booking.notes ?? "",
      referral: booking.referral ?? "",
      status: booking.status ?? "confirmed",
    });
    setEditPickupDate(booking.pickup_date ? new Date(booking.pickup_date + 'T12:00:00') : undefined);
    setEditReturnDate(booking.return_date ? new Date(booking.return_date + 'T12:00:00') : undefined);
    setEditError("");
    setEditingBooking(true);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBooking || !editForm) return;
    setEditError("");
    if (!editForm.client_name || !editPickupDate || !editReturnDate) {
      setEditError("Client name, pickup and return dates are required.");
      return;
    }
    setEditSubmitting(true);
    try {
      const payload = {
        ...editForm,
        pickup_date: format(editPickupDate, "yyyy-MM-dd"),
        return_date: format(editReturnDate, "yyyy-MM-dd"),
        total_price: editForm.total_price ? parseFloat(editForm.total_price) : null,
      };
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      setSelectedBooking(null);
      setEditingBooking(false);
      setEditForm(null);
      await fetchBookings();
    } catch {
      setEditError("Failed to update booking. Try again.");
    } finally {
      setEditSubmitting(false);
    }
  }

  const now = new Date();
  const thisMonth = bookings.filter((b) => {
    const d = new Date(b.pickup_date);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear() &&
      b.status !== "cancelled"
    );
  });

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-full max-w-sm px-8">
          <p className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-2 text-center font-light">
            Exotic Rentals
          </p>
          <h1 className="font-serif text-3xl font-light tracking-widest text-white text-center mb-10">
            ADMIN
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full bg-transparent border border-white/10 focus:border-[#c9a96e]/50 outline-none px-4 py-3 text-white text-sm tracking-widest placeholder-white/20 transition-colors duration-300"
            />
            {pwError && (
              <p className="text-red-400 text-[11px] tracking-wider text-center">
                Incorrect password
              </p>
            )}
            <button
              type="submit"
              className="w-full border border-[#c9a96e]/40 hover:border-[#c9a96e] text-[#c9a96e] text-[10px] tracking-[0.3em] uppercase py-3 font-light transition-all duration-300"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-3 md:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <p className="text-[#c9a96e] text-[9px] tracking-[0.4em] uppercase font-light mb-0.5">
            Exotic Rentals
          </p>
          <h1 className="font-serif text-xl font-light tracking-widest text-white">
            ADMIN
          </h1>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem("wh_admin");
            setAuthed(false);
          }}
          className="text-[10px] tracking-wider text-white/30 hover:text-white/60 uppercase transition-colors"
        >
          Sign out
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-8 py-10 space-y-10">
        {/* Tab Switcher */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 text-[10px] tracking-[0.3em] uppercase font-light transition-colors ${
              activeTab === "bookings"
                ? "text-[#c9a96e] border-b-2 border-[#c9a96e] -mb-px"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            📅 Bookings
          </button>
          <button
            onClick={() => setActiveTab("fleet")}
            className={`px-6 py-3 text-[10px] tracking-[0.3em] uppercase font-light transition-colors ${
              activeTab === "fleet"
                ? "text-[#c9a96e] border-b-2 border-[#c9a96e] -mb-px"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            🚗 Fleet
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-6 py-3 text-[10px] tracking-[0.3em] uppercase font-light transition-colors ${
              activeTab === "photos"
                ? "text-[#c9a96e] border-b-2 border-[#c9a96e] -mb-px"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            📸 Photos
          </button>
        </div>

        {activeTab === "fleet" && <FleetManagement />}
        {activeTab === "photos" && <PhotoLibrary />}

        {activeTab === "bookings" && (<>
        {/* New Booking CTA */}
        <div className="flex justify-end">
          <button
            onClick={() => addBookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="bg-[#c9a96e] text-black text-[10px] tracking-[0.3em] uppercase font-medium px-6 py-3 hover:bg-[#e2c898] transition-colors duration-300"
          >
            + New Booking
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="border border-white/5 bg-white/[0.02] px-6 py-5">
            <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 font-light mb-1">
              Total Bookings
            </p>
            <p className="text-3xl font-light text-white font-serif">
              {bookings.length}
            </p>
          </div>
          <div className="border border-white/5 bg-white/[0.02] px-6 py-5">
            <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 font-light mb-1">
              Active This Month
            </p>
            <p className="text-3xl font-light text-[#c9a96e] font-serif">
              {thisMonth.length}
            </p>
          </div>
        </div>

        {/* New Booking Form */}
        <div ref={addBookingRef} className="border border-[#c9a96e]/20 bg-white/[0.02] p-6">
          <h2 className="text-[13px] tracking-[0.3em] uppercase text-[#c9a96e] font-semibold mb-6">
            ✦ New Booking
          </h2>
          <form
            onSubmit={handleAddBooking}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Car */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">
                Car
              </label>
              <select
                value={form.car_name}
                onChange={(e) => setForm((f) => ({ ...f, car_name: e.target.value }))}
                className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide transition-colors"
              >
                {fleetCars.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Client Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-widests uppercase text-white/30 font-light">
                Client Name
              </label>
              <input
                type="text"
                value={form.client_name}
                onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                placeholder="Full name"
                className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-widests uppercase text-white/30 font-light">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.client_phone}
                onChange={(e) => setForm((f) => ({ ...f, client_phone: e.target.value }))}
                placeholder="+1 514..."
                className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors"
              />
            </div>

            {/* Deposit Status */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-widests uppercase text-white/30 font-light">
                Deposit Status <span className="text-white/15">($5k–$10k)</span>
              </label>
              <select
                value={form.deposit_status}
                onChange={(e) => setForm((f) => ({ ...f, deposit_status: e.target.value }))}
                className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide transition-colors"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="waived">Waived</option>
              </select>
            </div>

            {/* Payment Status */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-widests uppercase text-white/30 font-light">
                Payment Status
              </label>
              <select
                value={form.payment_status}
                onChange={(e) => setForm((f) => ({ ...f, payment_status: e.target.value }))}
                className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide transition-colors"
              >
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* Pickup Date */}
            <DatePickerInput
              label="Pickup Date"
              value={pickupDate}
              onChange={setPickupDate}
              placeholder="Select pickup date"
            />

            {/* Return Date */}
            <DatePickerInput
              label="Return Date"
              value={returnDate}
              onChange={setReturnDate}
              placeholder="Select return date"
            />

            {/* Total Price */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-widests uppercase text-white/30 font-light">
                Total Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.total_price}
                  onChange={(e) => setForm((f) => ({ ...f, total_price: e.target.value }))}
                  placeholder="0.00"
                  className="w-full bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none pl-6 pr-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors"
                />
              </div>
            </div>

            {/* Drop Off Location */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-widests uppercase text-white/30 font-light">
                Drop Off Location <span className="text-white/15">(optional)</span>
              </label>
              <input
                type="text"
                value={form.drop_off_location}
                onChange={(e) => setForm((f) => ({ ...f, drop_off_location: e.target.value }))}
                placeholder="Address or location"
                className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-[9px] tracking-widests uppercase text-white/30 font-light">
                Notes <span className="text-white/15">(optional)</span>
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Any notes..."
                rows={2}
                className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors resize-none"
              />
            </div>

            {/* Referral */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">
                Referral <span className="text-white/15">(optional)</span>
              </label>
              <input
                type="text"
                value={form.referral}
                onChange={(e) => setForm((f) => ({ ...f, referral: e.target.value }))}
                placeholder="How did they hear about us?"
                className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors"
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col gap-1 justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="border border-[#c9a96e]/40 hover:border-[#c9a96e] text-[#c9a96e] text-[10px] tracking-[0.2em] uppercase py-2.5 px-4 font-light transition-all duration-300 disabled:opacity-40"
              >
                {submitting ? "Adding..." : "Add Booking"}
              </button>
            </div>

            {formError && (
              <p className="col-span-full text-red-400 text-[11px] tracking-wider">
                {formError}
              </p>
            )}
          </form>
        </div>

        {/* Bookings Table */}
        <div>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] font-light mb-4">
            All Bookings
          </h2>
          {loading ? (
            <p className="text-white/30 text-xs tracking-wider">Loading...</p>
          ) : bookings.length === 0 ? (
            <p className="text-white/20 text-xs tracking-wider">No bookings yet.</p>
          ) : (
            <div className="border border-white/5 overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0">
              <table className="min-w-[900px] w-full text-xs font-light">
                <thead>
                  <tr className="border-b border-white/5">
                    {[
                      "Car",
                      "Client",
                      "Phone",
                      "Pickup",
                      "Return",
                      "Total Price",
                      "Deposit",
                      "Payment",
                      "Drop Off",
                      "Referral",
                      "Notes",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-[9px] tracking-[0.3em] uppercase text-white/25 font-light whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-white/80 tracking-wide whitespace-nowrap">
                        {b.car_name}
                      </td>
                      <td className="px-4 py-3 text-white/80 tracking-wide whitespace-nowrap">
                        {b.client_name}
                      </td>
                      <td className="px-4 py-3 text-white/50 whitespace-nowrap">
                        {b.client_phone ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-white/60 whitespace-nowrap">
                        {new Date(b.pickup_date).toLocaleDateString("en-CA")}
                      </td>
                      <td className="px-4 py-3 text-white/60 whitespace-nowrap">
                        {new Date(b.return_date).toLocaleDateString("en-CA")}
                      </td>
                      <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                        {b.total_price != null ? `$${Number(b.total_price).toLocaleString("en-CA", { minimumFractionDigits: 2 })}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge label={b.deposit_status ?? "pending"} />
                      </td>
                      <td className="px-4 py-3">
                        <Badge label={b.payment_status ?? "pending"} />
                      </td>
                      <td className="px-4 py-3 text-white/40 max-w-[120px] truncate">
                        {b.drop_off_location ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs max-w-[100px] truncate">
                        {b.referral ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-white/30 max-w-[140px] truncate">
                        {b.notes ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="text-[9px] tracking-wider uppercase text-red-500/50 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Calendar View */}
        <BookingsCalendar bookings={bookings} onSelectBooking={setSelectedBooking} />
        </>)}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => { setSelectedBooking(null); setEditingBooking(false); setEditForm(null); }}
        >
          <div
            className="bg-[#111] border border-white/10 max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => { setSelectedBooking(null); setEditingBooking(false); setEditForm(null); }}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-xl"
            >×</button>

            {!editingBooking ? (
              <>
                {/* Car name header */}
                <div className="mb-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] mb-1">Booking Details</p>
                  <h2 className="text-white text-xl font-bold">{selectedBooking.car_name}</h2>
                  <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded ${
                    selectedBooking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    selectedBooking.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}>{selectedBooking.status}</span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">Client</p>
                    <p className="text-white">{selectedBooking.client_name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">Phone</p>
                    <p className="text-white">{selectedBooking.client_phone ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">Pickup</p>
                    <p className="text-white">{selectedBooking.pickup_date ? new Date(selectedBooking.pickup_date).toLocaleDateString('en-CA') : '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">Return</p>
                    <p className="text-white">{selectedBooking.return_date ? new Date(selectedBooking.return_date).toLocaleDateString('en-CA') : '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">Total Price</p>
                    <p className="text-[#c9a96e] font-semibold">{selectedBooking.total_price ? `$${Number(selectedBooking.total_price).toLocaleString()}` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">Deposit</p>
                    <p className="text-white">{selectedBooking.deposit_status ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">Payment</p>
                    <p className="text-white">{selectedBooking.payment_status ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">Drop Off</p>
                    <p className="text-white">{selectedBooking.drop_off_location ?? '—'}</p>
                  </div>
                  {selectedBooking.referral && (
                    <div>
                      <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">Referral</p>
                      <p className="text-white">{selectedBooking.referral}</p>
                    </div>
                  )}
                  {selectedBooking.notes && (
                    <div className="col-span-2">
                      <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">Notes</p>
                      <p className="text-white/80">{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => openEditMode(selectedBooking)}
                    className="flex-1 border border-[#c9a96e]/40 text-[#c9a96e] text-xs tracking-widest uppercase py-2 hover:bg-[#c9a96e]/10 transition-colors"
                  >
                    Edit Booking
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('Delete this booking?')) return;
                      await fetch(`/api/bookings/${selectedBooking.id}`, { method: 'DELETE' });
                      setSelectedBooking(null);
                      const data = await fetch('/api/bookings').then(r => r.json());
                      setBookings(data);
                    }}
                    className="flex-1 border border-red-500/30 text-red-400 text-xs tracking-widest uppercase py-2 hover:bg-red-500/10 transition-colors"
                  >
                    Delete Booking
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Edit mode header */}
                <div className="mb-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] mb-1">Edit Booking</p>
                  <h2 className="text-white text-xl font-bold">{selectedBooking.car_name}</h2>
                </div>

                {editForm && (
                  <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">Car</label>
                      <select
                        value={editForm.car_name}
                        onChange={(e) => setEditForm(f => f ? { ...f, car_name: e.target.value } : f)}
                        className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide transition-colors"
                      >
                        {fleetCars.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">Client Name</label>
                        <input type="text" value={editForm.client_name}
                          onChange={(e) => setEditForm(f => f ? { ...f, client_name: e.target.value } : f)}
                          className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">Phone</label>
                        <input type="tel" value={editForm.client_phone}
                          onChange={(e) => setEditForm(f => f ? { ...f, client_phone: e.target.value } : f)}
                          className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <DatePickerInput label="Pickup Date" value={editPickupDate} onChange={setEditPickupDate} />
                      <DatePickerInput label="Return Date" value={editReturnDate} onChange={setEditReturnDate} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">Deposit Status</label>
                        <select value={editForm.deposit_status}
                          onChange={(e) => setEditForm(f => f ? { ...f, deposit_status: e.target.value } : f)}
                          className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide transition-colors"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="waived">Waived</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">Payment Status</label>
                        <select value={editForm.payment_status}
                          onChange={(e) => setEditForm(f => f ? { ...f, payment_status: e.target.value } : f)}
                          className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide transition-colors"
                        >
                          <option value="pending">Pending</option>
                          <option value="partial">Partial</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">Total Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">$</span>
                          <input type="number" min="0" step="0.01" value={editForm.total_price}
                            onChange={(e) => setEditForm(f => f ? { ...f, total_price: e.target.value } : f)}
                            className="w-full bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none pl-6 pr-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">Booking Status</label>
                        <select value={editForm.status}
                          onChange={(e) => setEditForm(f => f ? { ...f, status: e.target.value } : f)}
                          className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide transition-colors"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">Drop Off Location</label>
                      <input type="text" value={editForm.drop_off_location}
                        onChange={(e) => setEditForm(f => f ? { ...f, drop_off_location: e.target.value } : f)}
                        placeholder="Address or location"
                        className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">Referral</label>
                      <input type="text" value={editForm.referral}
                        onChange={(e) => setEditForm(f => f ? { ...f, referral: e.target.value } : f)}
                        placeholder="How did they hear about us?"
                        className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] tracking-widest uppercase text-white/30 font-light">Notes</label>
                      <textarea value={editForm.notes}
                        onChange={(e) => setEditForm(f => f ? { ...f, notes: e.target.value } : f)}
                        rows={2}
                        placeholder="Any notes..."
                        className="bg-[#111] border border-white/10 focus:border-[#c9a96e]/50 outline-none px-3 py-2.5 text-white text-xs tracking-wide placeholder-white/20 transition-colors resize-none"
                      />
                    </div>

                    {editError && (
                      <p className="text-red-400 text-[11px] tracking-wider">{editError}</p>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => { setEditingBooking(false); setEditForm(null); }}
                        className="flex-1 border border-white/10 text-white/40 text-xs tracking-widest uppercase py-2 hover:text-white/60 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={editSubmitting}
                        className="flex-1 border border-[#c9a96e]/40 hover:border-[#c9a96e] text-[#c9a96e] text-xs tracking-widest uppercase py-2 hover:bg-[#c9a96e]/10 transition-colors disabled:opacity-40"
                      >
                        {editSubmitting ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
