"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const authed = typeof window !== "undefined" && localStorage.getItem("pmr_admin_auth") === "true";
    if (!authed) {
      router.replace("/admin/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-obsidian">
        <div className="text-silver text-sm tracking-widest animate-pulse font-spec">EXOTIC RENTALS MONTREAL</div>
      </div>
    );
  }

  return <>{children}</>;
}