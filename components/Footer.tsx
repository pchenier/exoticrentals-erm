import { Phone, MessageCircle, Camera } from "lucide-react";
import ERMLogo from "./ERMLogo";

export default function Footer() {
  return (
    <footer className="bg-obsidian border-t border-graphite py-12 md:py-16 px-4 sm:px-6 lg:px-8 pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <ERMLogo size="md" showWordmark={true} />
            <p className="text-silver text-sm max-w-md mb-6 mt-4">
              Exotic car rentals in Montreal. By appointment only.
            </p>
            <div className="flex flex-col gap-3">
              <a href="https://instagram.com/exoticrentalsmontreal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-silver hover:text-champagne transition-colors text-sm">
                <Camera size={16} /> @exoticrentalsmontreal
              </a>
              <a href="tel:14388094417" className="flex items-center gap-2 text-silver hover:text-champagne transition-colors text-sm">
                <Phone size={16} /> 438-809-4417
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-bold text-xs tracking-[0.3em] text-warm-white mb-4">EXPLORE</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Fleet", href: "/fleet" },
                { label: "Location Voiture de Luxe", href: "/location-voiture-de-luxe-montreal" },
                { label: "Experience", href: "/experience" },
                { label: "About", href: "/about" },
                { label: "FAQ", href: "/faq" },
                { label: "Reviews", href: "/reviews" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <a key={link.href} href={link.href} className="text-silver hover:text-warm-white transition-colors text-sm">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-xs tracking-[0.3em] text-warm-white mb-4">SERVICES</h4>
            <div className="flex flex-col gap-2">
              {["Luxury Car Rental Montreal", "Weddings & Events", "Music Video / Photo Shoots", "Montreal Pickup Location", "Special Delivery Arrangements", "Weekly Rentals", "Corporate Leasing"].map((s) => (
                <a key={s} href="/contact" className="text-silver hover:text-warm-white transition-colors text-sm">{s}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-xs tracking-[0.3em] text-warm-white mb-4">GET IN TOUCH</h4>
            <div className="flex flex-col gap-2 text-sm text-silver">
              <span>Montreal, Quebec</span>
              <span>By appointment only</span>
              <a href="tel:14388094417" className="hover:text-champagne transition-colors">438-809-4417</a>
              <a href="https://wa.me/14388094417" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-champagne transition-colors">
                <MessageCircle size={16} /> WhatsApp Concierge
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-graphite flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-silver">&copy; {new Date().getFullYear()} Exotic Rentals Montreal. By Gestion Exotics Inc. All rights reserved.</div>
          <div className="text-xs text-silver">Montreal, Quebec</div>
        </div>
      </div>
    </footer>
  );
}