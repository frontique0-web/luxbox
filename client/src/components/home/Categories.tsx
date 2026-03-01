import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Palette, Watch, Gem, Smartphone, Cigarette, SprayCan } from "lucide-react";

const ICON_MAP: Record<string, any> = {
  "SprayCan": SprayCan,
  "Palette": Palette,
  "Watch": Watch,
  "Gem": Gem,
  "ShoppingBag": ShoppingBag,
  "Smartphone": Smartphone,
  "Cigarette": Cigarette,
};

const CATEGORY_IMAGES: Record<string, string> = {
  perfumes: "/assets/categories/perfumes.png",
  makeup_care: "/assets/categories/makeup.png",
  watches: "/assets/categories/watches.png",
  accessories: "/assets/categories/accessories.png",
  bags: "/assets/categories/bags.png",
  mobile: "/assets/categories/mobile-covers.png",
  vape: "/assets/categories/vape.png",
};


export default function Categories() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="font-arabic font-bold text-3xl md:text-4xl text-[#0B281F] mb-2 md:mb-4">أقسامنا</h2>
          <p className="font-serif text-[#D4AF37] text-lg md:text-xl tracking-widest">Our Collections</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-t-[140px] bg-gray-200" />
            ))
          ) : (
            categories.map((cat, index) => {
              const Icon = cat.icon ? ICON_MAP[cat.icon as keyof typeof ICON_MAP] || ShoppingBag : ShoppingBag;
              const bgImg = cat.imageUrl || CATEGORY_IMAGES[cat.slug] || "/assets/product-placeholder-1.png";

              return (
                <motion.div
                  key={cat.id}
                  className="group relative cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => {
                    const el = document.getElementById('catalog');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <div className="h-[280px] bg-[#143D30] rounded-t-[140px] flex flex-col items-center justify-center p-6 relative overflow-hidden transition-all duration-500 group-hover:-translate-y-2 shadow-lg group-hover:shadow-[#D4AF37]/20">

                    {/* Background Image Reveal Effect */}
                    <div className="absolute inset-0 bg-[#0B281F] opacity-100 transition-opacity duration-500 z-0 overflow-hidden">
                      <div className="w-full h-full bg-black/50 absolute inset-0 z-10 group-hover:bg-black/30 transition-colors duration-500" />
                      <img src={bgImg} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt={cat.nameAr} />
                    </div>

                    {/* Content */}
                    <div className="relative z-20 flex flex-col items-center text-center">
                      <Icon className="w-12 h-12 mb-4 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg" strokeWidth={1.5} />
                      <h3 className="font-arabic font-bold text-white text-xl md:text-2xl mb-1">{cat.nameAr}</h3>
                      <p className="font-serif text-white/70 text-sm md:text-base uppercase tracking-wider">{cat.nameEn}</p>
                    </div>

                    {/* Decorative Arch Line */}
                    <div className="absolute inset-2 border border-[#D4AF37]/20 rounded-t-[130px] z-10 pointer-events-none transition-all duration-500 group-hover:border-[#D4AF37]/60" />
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </section>
  );
}
