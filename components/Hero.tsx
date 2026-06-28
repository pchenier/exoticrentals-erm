"use client";

export default function Hero() {
  const scrollToFleet = () => {
    document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[65vh] md:min-h-screen md:min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
      {/* Full-bleed McLaren background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <picture>
        <source srcSet="/cars/mclaren_2.webp" type="image/webp" />
        <img
          src="/cars/mclaren_2.jpg"
          alt="McLaren supercar"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ zIndex: 0 }}
          fetchPriority="high"
          loading="eager"
          decoding="sync"
        />
      </picture>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.75) 100%)",
          zIndex: 1,
        }}
      />

      {/* Cinematic side bars */}
      <div
        className="absolute left-8 lg:left-16 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-[#c9a96e]/40 to-transparent animate-scale-y"
        style={{ opacity: 0, animationFillMode: "forwards", zIndex: 2 }}
      />
      <div
        className="absolute right-8 lg:right-16 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-[#c9a96e]/40 to-transparent animate-scale-y"
        style={{ opacity: 0, animationDelay: "0.2s", animationFillMode: "forwards", zIndex: 2 }}
      />

      {/* Main content */}
      <div className="relative text-center px-6 max-w-6xl mx-auto" style={{ zIndex: 3 }}>
        {/* Pre-headline */}
        <div
          className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-8 font-light animate-fade-in"
          style={{ opacity: 0, animationDelay: "0.1s", animationFillMode: "forwards" }}
        >
          Montreal · Québec · Est. 2020
        </div>

        {/* Main headline — cinematic split reveal */}
        <h1 className="font-display leading-none mb-0">
          {/* EXOTIC RENTALS — split reveal */}
          <div className="flex justify-center items-baseline gap-x-[0.15em] overflow-hidden text-[clamp(2rem,7vw,6rem)] md:text-[clamp(2.5rem,7vw,6rem)]">
            <span
              className="inline-block text-white animate-slide-left"
              style={{ opacity: 0, willChange: "transform", animationFillMode: "forwards" }}
            >
              EXOTIC
            </span>
            <span
              className="inline-block text-white animate-slide-right"
              style={{ opacity: 0, willChange: "transform", animationFillMode: "forwards" }}
            >
              RENTALS
            </span>
          </div>

          {/* Gold separator line */}
          <div
            className="h-px bg-[#c9a96e] w-full my-3 animate-draw-line"
            style={{ transform: "scaleX(0)", animationDelay: "0.85s", animationFillMode: "forwards" }}
          />

          {/* MONTREAL — fades up */}
          <div
            className="text-[clamp(1.5rem,5vw,4rem)] text-[#c9a96e] tracking-[0.2em] animate-fade-up"
            style={{ opacity: 0, animationDelay: "0.7s", animationFillMode: "forwards" }}
          >
            MONTREAL
          </div>
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/60 text-sm max-w-md mx-auto font-light leading-relaxed tracking-wide mt-8 mb-12 animate-fade-up"
          style={{ opacity: 0, animationDelay: "1.1s", animationFillMode: "forwards" }}
        >
          Twenty machines. One standard. The extraordinary.
        </p>

        {/* Single CTA */}
        <div
          className="flex justify-center items-center animate-fade-up"
          style={{ opacity: 0, animationDelay: "1.4s", animationFillMode: "forwards" }}
        >
          <button
            onClick={scrollToFleet}
            className="group px-12 py-4 bg-[#c9a96e] text-[#0a0a0a] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#e2c898] transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10">Discover the Fleet →</span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
        style={{ opacity: 0, animationDelay: "2.2s", animationFillMode: "forwards", zIndex: 3 }}
      >
        <span className="text-[10px] tracking-[0.25em] text-white/30 uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-[#c9a96e]/60 to-transparent animate-bounce-scroll" />
      </div>
    </section>
  );
}
