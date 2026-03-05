import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { HeroSlider } from "@shared/schema";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: sliders = [], isLoading } = useQuery<HeroSlider[]>({
    queryKey: ["/api/hero-sliders"],
    queryFn: async () => {
      const res = await fetch("/api/hero-sliders");
      if (!res.ok) throw new Error("Failed to fetch hero sliders");
      return res.json();
    }
  });

  // Default fallback images
  const images = sliders.length > 0
    ? sliders.map(s => s.imageUrl)
    : ["/assets/hero-bg.jpg", "/assets/store-interior.jpg"];

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="hero" className="w-full relative overflow-hidden bg-white mt-16 lg:mt-0 lg:h-screen lg:flex lg:items-center lg:justify-center">
      {/* Background Images for Desktop */}
      <div className="hidden lg:block absolute inset-0 z-0 bg-black">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt="Lux Box Background"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      {/* Mobile Layout (Hidden on lg and up) */}
      <div className="lg:hidden block w-full pt-6 pb-2 px-4 relative z-20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full rounded-2xl overflow-hidden h-40 sm:h-48 bg-[#0B281F] shadow-sm flex items-center justify-center"
          >
            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt="Lux Box Store"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Always show darkened overlay if there is text, or optional */}
            {!(sliders[currentIndex]?.hideText) && (
              <div className="absolute inset-0 bg-[#0B281F]/40 z-10"></div>
            )}

            {/* The Text Content */}
            {!(sliders[currentIndex]?.hideText) && (
              <div className="relative z-20 flex flex-col items-center text-center px-4 w-full">
                <h2 className="text-[#D4AF37] font-arabic text-xl sm:text-2xl font-bold mb-2 drop-shadow-md">
                  {sliders[currentIndex]?.title || "عالم الجمال الفاخر"}
                </h2>
                <p className="text-white/90 font-arabic text-xs sm:text-sm mb-4 max-w-[250px] leading-relaxed drop-shadow-md">
                  {sliders[currentIndex]?.subtitle || "تشكيلة حصرية من أفضل العلامات التجارية"}
                </p>
                <button
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#D4AF37] text-[#0B281F] px-6 py-2 rounded-lg font-bold font-arabic transition-all shadow-lg text-sm hover:scale-105"
                >
                  تسوقي الآن
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Desktop Text Content */}
      <div className="hidden lg:flex container mx-auto px-6 relative z-10 flex-col items-center justify-center text-center mt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center"
        >
          {/* Logo Text Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="mb-8 md:mb-12 drop-shadow-2xl relative w-full flex justify-center"
          >
            <img
              src="/assets/lux-box-extracted.png"
              alt="LUX BOX"
              className="h-16 lg:h-32 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            />
          </motion.div>

          <h2 className="text-[#D4AF37] font-arabic text-4xl lg:text-5xl font-bold mb-6 drop-shadow-md">
            عالم الجمال الفاخر
          </h2>

          <p className="text-white/90 font-arabic text-xl lg:text-2xl mb-12 max-w-2xl leading-relaxed drop-shadow-md">
            تشكيلة حصرية من أفضل العلامات التجارية لتعكس شخصيتك الفريدة.
          </p>

          <button
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#D4AF37] text-[#0B281F] px-10 py-4 rounded-full font-bold font-arabic hover:bg-white hover:scale-105 transition-all duration-300 text-lg shadow-xl"
          >
            تسوقي الآن
          </button>
        </motion.div>
      </div>
    </section>
  );
}
