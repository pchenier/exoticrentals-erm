"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { faqs, reviews, vehicles as staticVehicles } from "@/lib/data";
import type { Vehicle } from "@/lib/data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import BookingModal from "@/components/BookingModal";
import { Star, ChevronDown, ArrowRight } from "lucide-react";

export default function HomeClient({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>(initialVehicles.length > 0 ? initialVehicles : staticVehicles);

  // Only fetch client-side if server didn't provide live data (fallback)
  useEffect(() => {
    if (initialVehicles.length === 0) {
      fetch('/api/vehicles')
        .then(r => r.json())
        .then(data => { if (Array.isArray(data) && data.length > 0) setAllVehicles(data); })
        .catch(() => {});
    }
  }, [initialVehicles.length]);

  const featuredVehicles = allVehicles.filter(v => v.featured).sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
  const availableCount = allVehicles.filter(v => v.available).length;

  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-bg.jpg" alt="Montreal exotic cars" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent" />
        </div>
        <div className="relative z-10 px-6 lg:px-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="text-[10px] md:text-xs font-display font-bold tracking-[0.3em] text-champagne mb-3 md:mb-4">MONTREAL · QUEBEC</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-[-0.05em] text-warm-white leading-[0.95] mb-4 md:mb-6">
              Exotic Car Rentals<br />in Montreal
            </h1>
            <p className="text-silver text-base md:text-lg lg:text-xl max-w-lg mb-8 md:mb-10">
              Drive the world's most iconic supercars with a seamless online reservation process. Pick up at our Montreal location, ready and detailed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <a href="/fleet" className="px-6 md:px-8 py-3 md:py-4 bg-champagne text-obsidian font-body font-bold tracking-[0.1em] text-xs md:text-sm hover:bg-champagne/90 transition-colors text-center">
                VIEW THE FLEET
              </a>
              <a href="#fleet" className="px-6 md:px-8 py-3 md:py-4 border border-warm-white/30 text-warm-white font-body font-bold tracking-[0.1em] text-xs md:text-sm hover:border-champagne hover:text-champagne transition-colors text-center">
                SCROLL DOWN ↓
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Fleet */}
      <section id="fleet" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">THE COLLECTION</div>
            <h2 className="font-display font-extrabold tracking-[-0.02em] text-3xl md:text-4xl text-warm-white">FEATURED VEHICLES</h2>
            <div className="text-sm text-silver mt-3">{availableCount} vehicles available</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="/fleet" className="inline-flex items-center gap-2 px-8 py-3 border border-silver text-silver font-body font-bold tracking-[0.1em] text-xs hover:border-champagne hover:text-champagne transition-colors">
              VIEW FULL FLEET <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-graphite">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">CLIENT REVIEWS</div>
            <h2 className="font-display font-extrabold tracking-[-0.02em] text-3xl md:text-4xl text-warm-white">What Our Clients Say</h2>
            <div className="text-sm text-silver mt-3">5.0 / 5. Based on verified reviews</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((review, i) => (
              <motion.div key={review.id} className="bg-obsidian p-6 border border-graphite" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={16} className={j < review.rating ? "text-champagne fill-champagne" : "text-graphite"} />
                  ))}
                </div>
                <p className="text-silver text-sm leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-warm-white text-sm font-medium">{review.customerLabel}</div>
                    <div className="text-xs text-silver">{review.vehicle}</div>
                  </div>
                  {review.verified && <span className="text-xs text-champagne">Verified</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Standard */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">THE STANDARD</div>
            <h2 className="font-display font-extrabold tracking-[-0.02em] text-3xl md:text-4xl text-warm-white">Unmatched Performance, Meticulously Maintained.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Montreal Pickup", desc: "Pick up your vehicle at our Montreal location, detailed and fueled. Delivery available for special arrangements." },
              { title: "Meticulous Maintenance", desc: "Each vehicle undergoes a multi-point inspection and professional detail before every rental." },
              { title: "Total Discretion", desc: "Your privacy is paramount. Our service is confidential, professional, and tailored to your schedule." },
            ].map((item, i) => (
              <motion.div key={item.title} className="text-center py-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <h3 className="font-display font-bold text-xl tracking-[-0.02em] text-warm-white mb-4">{item.title}</h3>
                <p className="text-silver text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-graphite">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">THE PROTOCOL</div>
            <h2 className="font-display font-extrabold tracking-[-0.02em] text-3xl md:text-4xl text-warm-white">Four Steps to the Drive.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01", title: "SELECTION", desc: "Browse our curated fleet of the world's most sought-after supercars." },
              { num: "02", title: "VERIFICATION", desc: "Quick identity verification, insurance check, and deposit. Under 30 minutes." },
              { num: "03", title: "PICKUP", desc: "Pick up your vehicle at our Montreal location, detailed and fueled. Delivery available by special arrangement." },
              { num: "04", title: "THE DRIVE", desc: "Enjoy 24/7 concierge support throughout your entire rental period." },
            ].map((step, i) => (
              <motion.div key={step.num} className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="font-display font-extrabold text-5xl text-champagne mb-4">{step.num}</div>
                <h3 className="font-display font-semibold text-lg text-warm-white mb-2">{step.title}</h3>
                <p className="text-silver text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">INQUIRIES</div>
            <h2 className="font-display font-extrabold tracking-[-0.02em] text-3xl md:text-4xl text-warm-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-0">
            {faqs.slice(0, 6).map((faq) => (
              <div key={faq.id} className="border-b border-graphite">
                <button className="w-full flex items-center justify-between py-5 text-left hover:bg-graphite/50 transition-colors px-4" onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}>
                  <span className="text-warm-white font-medium">{faq.question}</span>
                  <ChevronDown size={20} className={`text-champagne transition-transform ${openFaq === faq.id ? "rotate-180" : ""}`} />
                </button>
                {openFaq === faq.id && (
                  <div className="px-4 pb-5 text-silver text-sm leading-relaxed">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-graphite">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-extrabold tracking-[-0.02em] text-3xl md:text-4xl text-warm-white mb-6">Your Montreal Ride Is One Call Away</h2>
          <p className="text-silver mb-8">Contact our concierge team for availability, custom requests, or special delivery arrangements.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:14388094417" className="px-8 py-4 bg-champagne text-obsidian font-body font-bold tracking-[0.1em] text-xs hover:bg-champagne/90 transition-colors">CALL 438-809-4417</a>
            <button onClick={() => setBookingOpen(true)} className="px-8 py-4 border border-silver text-silver font-body font-bold tracking-[0.1em] text-xs hover:border-champagne hover:text-champagne transition-colors">BOOK ONLINE</button>
          </div>
          <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoRental",
            name: "Exotic Rentals Montreal",
            telephone: "438-809-4417",
            areaServed: "Montreal, QC",
            url: "https://exoticrentalsmontreal.com",
          }),
        }}
      />
      <Footer />
    </>
  );
}