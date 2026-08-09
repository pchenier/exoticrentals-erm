import { ShieldCheck, MapPin, Lock, MessageCircle, Car, Eye } from "lucide-react";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Premier Verified Fleet",
    description: "Every listed vehicle follows Exotic Rentals Montreal' internal presentation and quality standards.",
  },
  {
    icon: MapPin,
    title: "Montreal Pickup",
    description: "Pick up your vehicle at our Montreal location, detailed and ready. Delivery available by special arrangement for select cases.",
  },
  {
    icon: Lock,
    title: "Secure Reservations",
    description: "Reservation details and customer information are handled through a secure process.",
  },
  {
    icon: MessageCircle,
    title: "Direct Communication",
    description: "Customers communicate directly with the concierge team throughout the reservation.",
  },
  {
    icon: Car,
    title: "Carefully Selected Vehicles",
    description: "The fleet is curated instead of being presented as an unlimited marketplace.",
  },
  {
    icon: Eye,
    title: "Discreet Service",
    description: "Customer information, logistics, and rental details are handled professionally.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-graphite">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs font-spec tracking-[0.3em] text-champagne mb-4">
            TRUST & VERIFICATION
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-warm-white mb-4">
            The Premier Standard
          </h2>
          <p className="text-silver max-w-2xl mx-auto">
            Every reservation is handled with the same attention to detail, from
            the first request to the final collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustPoints.map((point, i) => (
            <div
              key={point.title}
              className="flex flex-col items-start gap-4 p-6 border border-graphite hover:border-silver/20 transition-colors"
            >
              <point.icon size={24} className="text-champagne" strokeWidth={1.5} />
              <h3 className="font-display text-lg text-warm-white">
                {point.title}
              </h3>
              <p className="text-sm text-silver leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
