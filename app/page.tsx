export const metadata = {
  title: 'Exotic Rentals Montreal — Rebuilding in Progress',
  description: 'Exotic Rentals Montreal is rebuilding. We will be back soon. For inquiries, call or text 438-809-4417.',
  robots: { index: true, follow: true },
};

export default function RebuildingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-6 text-center">
      <div className="max-w-2xl">
        <h1
          className="font-[var(--font-display),Bebas_Neue,Impact,sans-serif] text-6xl sm:text-7xl md:text-8xl tracking-[0.02em] leading-[0.95] mb-6"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.02em' }}
        >
          EXOTIC RENTALS<br />
          <span className="text-[#D4BC9A]">MONTREAL</span>
        </h1>
        <div className="w-16 h-px bg-[#D4BC9A] mx-auto mb-8" />
        <p
          className="text-lg sm:text-xl md:text-2xl text-[#C0C0C8] font-light tracking-wide mb-2"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Rebuilding in Progress
        </p>
        <p
          className="text-sm sm:text-base text-[#888] tracking-[0.15em] uppercase mb-12"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          We will be back soon
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="tel:+14388094417"
            className="px-8 py-3 bg-[#D4BC9A] text-[#0a0a0a] font-bold tracking-[0.1em] text-sm uppercase transition-colors hover:bg-[#D4BC9A]/90"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Call 438-809-4417
          </a>
          <a
            href="https://wa.me/14388094417"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border border-[#C0C0C8]/30 text-[#C0C0C8] font-bold tracking-[0.1em] text-sm uppercase transition-colors hover:border-[#D4BC9A] hover:text-[#D4BC9A]"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}