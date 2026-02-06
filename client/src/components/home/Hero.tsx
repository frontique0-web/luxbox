import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-[#0B281F]">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B281F] via-[#0B281F]/50 to-transparent z-10" />
        <img 
          src="/assets/store-interior.jpg" 
          alt="Lux Box Interior" 
          className="w-full h-full object-cover opacity-80"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img 
            src="/logo-text.png" 
            alt="LUX BOX" 
            className="h-16 md:h-24 lg:h-32 object-contain brightness-0 invert"
          />
        </motion.div>
        
        <motion.p 
          className="font-arabic text-xl md:text-3xl text-white/90 mb-12 font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          جمعنا لك كل شيء .. في مكان واحد
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button 
            variant="outline" 
            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B281F] px-8 py-6 text-lg font-arabic tracking-wide transition-all duration-300 rounded-full uppercase"
          >
            تصفح المجموعات الحصرية
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent animate-pulse" />
        <span className="text-[#D4AF37] text-xs tracking-widest uppercase font-sans">Scroll</span>
      </motion.div>
    </section>
  );
}
