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
        className="btn-gold-3d flex-1 py-4 text-center font-display tracking-[0.15em]"
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