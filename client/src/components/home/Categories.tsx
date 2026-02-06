import { motion } from "framer-motion";

const categories = [
  { id: 1, name: "عطورات", eng: "Perfumes", icon: "🧴" },
  { id: 2, name: "مكياج وعناية", eng: "Makeup & Care", icon: "💄" },
  { id: 3, name: "إكسسوارات", eng: "Accessories", icon: "💍" },
  { id: 4, name: "ساعات", eng: "Watches", icon: "⌚" },
  { id: 5, name: "شناتي", eng: "Bags", icon: "👜" },
  { id: 6, name: "كفرات موبايل", eng: "Mobile Covers", icon: "📱" },
];

export default function Categories() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-arabic font-bold text-4xl text-[#0B281F] mb-4">أقسامنا</h2>
          <p className="font-serif text-[#D4AF37] text-xl tracking-widest">Our Collections</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              className="group relative cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="h-[280px] bg-[#143D30] rounded-t-[140px] flex flex-col items-center justify-center p-6 relative overflow-hidden transition-all duration-500 group-hover:-translate-y-2 shadow-lg group-hover:shadow-[#D4AF37]/20">
                
                {/* Hover Background Image Reveal Effect */}
                <div className="absolute inset-0 bg-[#0B281F] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                  <div className="w-full h-full bg-black/40 absolute inset-0 z-10" />
                  {/* Placeholder for category image */}
                  <img src="/assets/product-placeholder-1.png" className="w-full h-full object-cover opacity-50" alt="" />
                </div>

                {/* Content */}
                <div className="relative z-20 flex flex-col items-center">
                  <span className="text-4xl mb-4 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">{cat.icon}</span>
                  <h3 className="font-arabic font-bold text-white text-lg mb-1">{cat.name}</h3>
                  <p className="font-serif text-white/60 text-xs uppercase tracking-wider">{cat.eng}</p>
                </div>

                {/* Decorative Arch Line */}
                <div className="absolute inset-2 border border-[#D4AF37]/20 rounded-t-[130px] z-10 pointer-events-none transition-all duration-500 group-hover:border-[#D4AF37]/60" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
