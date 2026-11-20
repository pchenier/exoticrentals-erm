"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";
import { isBookable, vehicleStatus, STATUS_LABEL, type VehicleStatus } from "@/lib/data";

export default function BookButton({
  vehicleName,
  vehicleId,
  status,
}: {
  vehicleName: string;
  vehicleId?: string;
  status?: VehicleStatus;
}) {
  const [open, setOpen] = useState(false);

  if (!isBookable({ status })) {
    return (
      <button
        disabled
        className="flex-1 py-4 text-center font-display tracking-[0.15em] border border-silver/20 text-silver/60 cursor-not-allowed"
      >
        {STATUS_LABEL[vehicleStatus({ status })].toUpperCase()}
      </button>
    );
  }

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