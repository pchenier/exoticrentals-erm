"use client";

const pillars = [
  {
    number: "01",
    title: "Concierge Service",
    description:
      "From the moment you inquire, a dedicated specialist handles every detail. We learn your preferences, anticipate your needs, and ensure your experience is seamless from first contact to final key return.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
        <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Flexible Pickup",
    description:
      "Your schedule, your location. We deliver directly to your hotel, residence, or preferred landmark across greater Montreal. Airport transfers and cross-provincial arrangements available upon request.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "24/7 Support",
    description:
      "Luxury doesn't keep business hours, and neither do we. Our support line operates around the clock — whether you need roadside assistance, an extension, or simply a recommendation for the best route.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.66A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-32 bg-[#0a0a0a] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-24">
          <p className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-4 font-light">
            White Glove
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light tracking-wide text-white mb-6">
            The Experience
          </h2>
          <p className="text-white/40 text-sm max-w-xl mx-auto font-light leading-relaxed tracking-wide">
            We don&apos;t simply rent cars. We craft moments that you&apos;ll
            recall long after the keys are returned.
          </p>
          <div className="w-16 h-px bg-[#c9a96e] mx-auto mt-8" />
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.number}
              className={`relative p-10 lg:p-14 group ${
                i < pillars.length - 1
                  ? "border-b md:border-b-0 md:border-r border-white/5"
                  : ""
              }`}
            >
              {/* Background hover effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#c9a96e]/0 to-[#c9a96e]/0 group-hover:from-[#c9a96e]/[0.02] group-hover:to-[#c9a96e]/[0.04] transition-all duration-700" />

              {/* Number */}
              <span className="font-display text-7xl font-light text-white/[0.04] absolute top-8 right-8 leading-none select-none">
                {pillar.number}
              </span>

              {/* Icon */}
              <div className="text-[#c9a96e] mb-8 relative z-10">
                {pillar.icon}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-light tracking-wide text-white mb-4 group-hover:text-[#c9a96e] transition-colors duration-300">
                  {pillar.title}
                </h3>
                <div className="w-8 h-px bg-[#c9a96e]/50 mb-5" />
                <p className="text-white/40 text-sm font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom accent */}
        <div className="mt-24 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent" />
      </div>
    </section>
  );
}
