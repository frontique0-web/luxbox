import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Catalog from "@/components/home/Catalog";
import Features from "@/components/home/Features";
import Reviews from "@/components/home/Reviews";
import Contact from "@/components/home/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="w-full bg-white text-[#1A1A1A] selection:bg-[#D4AF37] selection:text-white">
      <Navbar />
      <Hero />
      <Catalog />
      <About />
      <Features />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  );
}
