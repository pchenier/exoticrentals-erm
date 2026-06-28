import { Metadata } from 'next';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Fleet from "@/components/Fleet";
import Experience from "@/components/Experience";
import HowItWorks from "@/components/HowItWorks";
import BookingForm from "@/components/BookingForm";
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer";
import LocationPills from "@/components/LocationPills";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }): Promise<Metadata> {
  const params = await searchParams;
  // Noindex URLs with ?car= query param to prevent duplicate content
  if (params.car) {
    return {
      robots: { index: false, follow: true },
    };
  }
  return {};
}

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <Fleet />
      <LocationPills />
      <Experience />
      <HowItWorks />
      <BookingForm />
      <BookingCTA />
      <Footer />
    </main>
  );
}