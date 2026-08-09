import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, Phone } from "lucide-react";

export const metadata = {
  title: "Contact | Exotic Rentals Montreal",
  description: "Get in touch with Exotic Rentals Montreal for reservations, press, or private inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-obsidian min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">
              BY APPOINTMENT
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-warm-white mb-4">
              Get in Touch.
            </h1>
            <p className="text-silver max-w-xl mx-auto">
              For reservations, press, or private inquiries.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Concierge Card */}
            <div className="bg-graphite border border-graphite p-10 text-center flex flex-col items-center hover:border-champagne/30 transition-colors">
              <Mail size={28} className="text-champagne mb-6" />
              <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-3">
                CONCIERGE
              </div>
              <a
                href="mailto:concierge@exoticrentalsmontreal.com"
                className="font-display font-bold text-xl tracking-[-0.02em] text-warm-white hover:text-champagne transition-colors mb-3"
              >
                concierge@exoticrentalsmontreal.com
              </a>
              <p className="text-sm text-silver">
                Response in 30 minutes average
              </p>
            </div>

            {/* Direct Line Card */}
            <div className="bg-graphite border border-graphite p-10 text-center flex flex-col items-center hover:border-champagne/30 transition-colors">
              <Phone size={28} className="text-champagne mb-6" />
              <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-3">
                DIRECT LINE
              </div>
              <a
                href="tel:14388094417"
                className="font-display font-bold text-xl tracking-[-0.02em] text-warm-white hover:text-champagne transition-colors mb-3"
              >
                438-809-4417
              </a>
              <p className="text-sm text-silver">
                Mon to Sun, 9AM to 9PM / text
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}