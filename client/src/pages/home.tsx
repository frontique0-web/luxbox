import { lazy, Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Catalog from "@/components/home/Catalog";
import NewArrivals from "@/components/home/NewArrivals";
import Features from "@/components/home/Features";
import Footer from "@/components/layout/Footer";

const Reviews = lazy(() => import("@/components/home/Reviews"));
const Contact = lazy(() => import("@/components/home/Contact"));

export default function Home() {
  return (
    <main className="w-full bg-white text-[#1A1A1A] selection:bg-[#D4AF37] selection:text-white">
      <Navbar />
      <Hero />
      <Catalog />
      <NewArrivals />
      <About />
      <Features />
      <Suspense fallback={<div className="h-64 flex items-center justify-center bg-gray-50"></div>}>
        <Reviews />
        <Contact />
      </Suspense>
      <Footer />
    </main>
  );
}
