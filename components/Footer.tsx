"use client";
import Link from "next/link";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";

const currentYear = new Date().getFullYear();

const footerLinks = [
  { label: "Fleet", href: "#fleet" },
  { label: "Experience", href: "#experience" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Book Now", href: "#booking" },
];

export default function Footer() {
  const handleClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#060606] border-t border-white/5 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Logo + tagline */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img src="/erm-logo.svg" alt="Exotic Rentals Montreal" className="h-16 w-auto opacity-90" />
            </div>
            <div className="w-10 h-px bg-[#c9a96e]/40 mb-5" />
            <p className="text-white/30 text-xs font-light leading-relaxed max-w-xs">
              Montreal&apos;s premier exotic vehicle experience. Concierge
              service. Exceptional machines. No compromises.
            </p>

            {/* Location */}
            <div className="mt-6 flex items-center gap-2 text-white/20 text-xs">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="tracking-widest">Montreal, QC, Canada</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[9px] tracking-[0.35em] text-[#c9a96e] uppercase mb-6 font-light">
              Navigation
            </h4>
            <nav className="space-y-3">
              {footerLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleClick(link.href)}
                  className="block text-xs tracking-[0.15em] text-white/35 hover:text-white transition-colors duration-300 font-light uppercase"
                >
                  {link.label}
                </button>
              ))}
              <Link
                href="/blog"
                className="block text-xs tracking-[0.15em] text-white/35 hover:text-white transition-colors duration-300 font-light uppercase"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="block text-xs tracking-[0.15em] text-white/35 hover:text-white transition-colors duration-300 font-light uppercase"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[9px] tracking-[0.35em] text-[#c9a96e] uppercase mb-6 font-light">
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:contact@exoticrentalsmontreal.com"
                className="block text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light"
              >
                contact@exoticrentalsmontreal.com
              </a>
              <a
                href="tel:+14385339053"
                onClick={() => trackPhoneClick("footer_phone")}
                className="block text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light"
              >
                438‑533‑9053
              </a>
              <a
                href="https://wa.me/+14385339053"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("footer_whatsapp")}
                className="block text-xs tracking-wide text-white/35 hover:text-[#c9a96e] transition-colors duration-300 font-light"
              >
                WhatsApp — Available 24 / 7
              </a>
            </div>



            {/* Social / WhatsApp CTA */}
            <div className="mt-8">
              <a
                href="https://wa.me/+14385339053"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("footer_start_conversation")}
                className="inline-flex items-center gap-2 text-[#c9a96e] text-[9px] tracking-[0.25em] uppercase font-light hover:gap-3 transition-all duration-300 group"
              >
                <span>Start a Conversation</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="group-hover:translate-x-0.5 transition-transform"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Our Fleet — visible SEO links */}
        <div className="mt-12 pt-10 border-t border-white/5">
          <h4 className="text-[9px] tracking-[0.35em] text-[#c9a96e] uppercase mb-6 font-light">
            Our Fleet
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-3">
            <Link href="/cars/audi-rs5" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Audi RS5</Link>
            <Link href="/cars/audi-rs6" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Audi RS6</Link>
            <Link href="/cars/audi-rs7" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Audi RS7</Link>
            <Link href="/cars/audi-r8" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Audi R8</Link>
            <Link href="/cars/bmw-m3-competition-isle-of-man-green" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">BMW M3 Competition</Link>
            <Link href="/cars/bmw-m5-competition" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">BMW M5 Competition</Link>
            <Link href="/cars/bmw-x5-m-competition" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">BMW X5 M Competition</Link>
            <Link href="/cars/mercedes-benz-e63s-amg" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Mercedes E63S AMG</Link>
            <Link href="/cars/mercedes-benz-s63-amg" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Mercedes S63 AMG</Link>
            <Link href="/cars/mercedes-g63-amg" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Mercedes G63 AMG</Link>
            <Link href="/cars/ferrari-488-gtb" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Ferrari 488 GTB</Link>
            <Link href="/cars/porsche-911-4s-techart" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Porsche 911 4S Techart</Link>
            <Link href="/cars/lamborghini-urus-black-on-black" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Lamborghini Urus</Link>
            <Link href="/cars/lamborghini-urus-blue-on-blue" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Lamborghini Urus Blue</Link>
            <Link href="/cars/lamborghini-urus-grey" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Lamborghini Urus Grey</Link>
            <Link href="/cars/lamborghini-huracan-tecnica" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Lamborghini Huracan Tecnica</Link>
            <Link href="/cars/lamborghini-huracan-evo" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Lamborghini Huracan Evo</Link>
            <Link href="/cars/lamborghini-huracan-evo-spyder" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">Huracan Evo Spyder</Link>
            <Link href="/cars/mclaren-570gt" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">McLaren 570GT</Link>
            <Link href="/cars/mclaren-600lt" className="text-xs tracking-wide text-white/35 hover:text-white transition-colors duration-300 font-light">McLaren 600LT</Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/luxury-car-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-[#c9a96e] transition-colors duration-300 font-light">Luxury Car Rental Montreal</Link>
            <Link href="/audi-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-[#c9a96e] transition-colors duration-300 font-light">Audi Rental Montreal</Link>
            <Link href="/mercedes-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-[#c9a96e] transition-colors duration-300 font-light">Mercedes Rental Montreal</Link>
            <Link href="/bmw-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-[#c9a96e] transition-colors duration-300 font-light">BMW Rental Montreal</Link>
            <Link href="/lamborghini-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-[#c9a96e] transition-colors duration-300 font-light">Lamborghini Rental Montreal</Link>
            <Link href="/mclaren-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-[#c9a96e] transition-colors duration-300 font-light">McLaren Rental Montreal</Link>
            <Link href="/ferrari-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-[#c9a96e] transition-colors duration-300 font-light">Ferrari Rental Montreal</Link>
            <Link href="/porsche-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-[#c9a96e] transition-colors duration-300 font-light">Porsche Rental Montreal</Link>
            <Link href="/car-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-[#c9a96e] transition-colors duration-300 font-light">Car Rental Montreal</Link>
          </div>
        </div>

        {/* Locations + Brands SEO links */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[9px] tracking-[0.35em] text-[#c9a96e] uppercase mb-4 font-light">
                Locations
              </h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <Link href="/locations/plateau-mont-royal" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Plateau Mont-Royal</Link>
                <Link href="/locations/old-montreal" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Old Montreal</Link>
                <Link href="/locations/westmount" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Westmount</Link>
                <Link href="/locations/griffintown" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Griffintown</Link>
                <Link href="/locations/mile-end" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Mile End</Link>
                <Link href="/locations/outremont" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Outremont</Link>
                <Link href="/locations/saint-laurent" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Saint-Laurent</Link>
                <Link href="/locations/verdun" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Verdun</Link>
                <Link href="/locations/laval" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Laval</Link>
                <Link href="/locations/longueuil" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Longueuil</Link>
                <Link href="/locations/brossard" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Brossard</Link>
                <Link href="/locations/gatineau" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Gatineau</Link>
                <Link href="/locations" className="text-xs tracking-wide text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors duration-300 font-light">View All Locations →</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[9px] tracking-[0.35em] text-[#c9a96e] uppercase mb-4 font-light">
                Brands
              </h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <Link href="/audi-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Audi</Link>
                <Link href="/mercedes-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Mercedes</Link>
                <Link href="/bmw-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">BMW</Link>
                <Link href="/lamborghini-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Lamborghini</Link>
                <Link href="/mclaren-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">McLaren</Link>
                <Link href="/ferrari-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Ferrari</Link>
                <Link href="/porsche-rental-montreal" className="text-xs tracking-wide text-white/25 hover:text-white transition-colors duration-300 font-light">Porsche</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-[10px] tracking-[0.2em] font-light">
            © {currentYear} Exotic Rentals Montreal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.quo.com/policies/ORrOf5XtVY"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/20 text-[10px] tracking-[0.15em] font-light hover:text-white/40 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <span className="text-white/10">·</span>
            <p className="text-white/15 text-[10px] tracking-[0.15em] font-light">
              Montreal · Quebec · Canada
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
