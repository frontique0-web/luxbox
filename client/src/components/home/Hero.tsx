import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="hero" className="w-full relative overflow-hidden bg-white mt-16 lg:mt-0 lg:h-screen lg:flex lg:items-center lg:justify-center">
      {/* Mobile Layout (Hidden on lg and up) */}
      <div className="lg:hidden block w-full pt-6 pb-2 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full rounded-2xl overflow-hidden aspect-[21/9] bg-[#0B281F] shadow-sm flex items-center"
          >
            {/* Subtle background texture - extremely low opacity to preserve dark green brand color without mix-blend */}
            <div className="absolute inset-0 bg-[url('/assets/marble-bg.png')] opacity-[0.05]"></div>

            <div className="flex w-full h-full items-center justify-between z-10 p-4 relative">
              {/* The small store front image */}
              <div className="w-5/12 h-full flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative w-full h-full max-h-[90%] rounded-xl overflow-hidden shadow-2xl border border-[#D4AF37]/20"
                >
                  <img src="/assets/store-interior.jpg" alt="Lux Box Store" className="w-full h-full object-cover" />
                </motion.div>
              </div>

              {/* The Text Content */}
              <div className="w-7/12 flex flex-col items-end text-right pr-2 justify-center">
                <h2 className="text-[#D4AF37] font-arabic text-lg sm:text-xl font-bold mb-2 drop-shadow-md">
                  عالم الجمال الفاخر
                </h2>
                <p className="text-white/90 font-arabic text-[10px] sm:text-xs mb-3 max-w-[150px] leading-relaxed">
                  تشكيلة حصرية من أفضل العلامات التجارية
                </p>
                <button
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#D4AF37] text-[#0B281F] px-4 py-1.5 rounded-lg font-bold font-arabic transition-colors text-[10px]"
                >
                  تسوقي الآن
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Layout (Hidden on mobile) */}
      <div className="hidden lg:block absolute inset-0 z-0">
        <img
          src="/assets/hero-bg.jpg"
          alt="Lux Box Background"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/assets/store-interior.jpg"; // Fallback
          }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

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
