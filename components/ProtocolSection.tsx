const steps = [
  { number: "01", title: "Selection", description: "Explore the fleet or request a specific vehicle." },
  { number: "02", title: "Reservation", description: "Select dates and submit the reservation request. Note any special delivery arrangements." },
  { number: "03", title: "Verification", description: "Complete the required identity, licence, insurance, and payment checks." },
  { number: "04", title: "Confirmation", description: "Receive final reservation details from the concierge team." },
  { number: "05", title: "Pickup", description: "The vehicle is prepared, detailed, and ready for pickup at our Montreal location. Delivery available by special arrangement." },
  { number: "06", title: "Experience", description: "Enjoy the vehicle with direct concierge support throughout the rental." },
];

export default function ProtocolSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-obsidian">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs font-spec tracking-[0.3em] text-champagne mb-4">
            SERVICE PROTOCOL
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-warm-white">
            The Premier Protocol
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="font-spec text-6xl text-graphite mb-4">
                {step.number}
              </div>
              <h3 className="font-display text-xl text-warm-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-silver leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
