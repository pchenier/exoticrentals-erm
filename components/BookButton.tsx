"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";

export default function BookButton({
  vehicleName,
  vehicleId,
}: {
  vehicleName: string;
  vehicleId?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex-1 py-4 bg-champagne text-obsidian text-center font-display tracking-[0.15em] hover:bg-champagne/90 transition-colors"
      >
        BOOK THIS VEHICLE
      </button>
      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        vehicleName={vehicleName}
        vehicleId={vehicleId}
      />
    </>
  );
}