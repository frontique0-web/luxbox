import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  SprayCan,
  Palette,
  Watch, 
  Gem,
  ShoppingBag,
  Smartphone,
  Loader2,
  Cigarette,
  ChevronLeft
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchSubcategories, fetchBrands, fetchProducts } from "@/lib/api";
import type { Category, Subcategory, Brand, Product } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import VapeCatalog from "./VapeCatalog";

const ICON_MAP: Record<string, any> = {
  SprayCan,
  Palette,
  Watch,
  Gem,
  ShoppingBag,
  Smartphone,
  Cigarette
};

export default function Catalog() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<number | null>(null);
  const [activeBrandId, setActiveBrandId] = useState<number | null>(null);
  const { addToCart } = useCart();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });

  const { data: subcategories = [], isLoading: subcategoriesLoading } = useQuery({
    queryKey: ["subcategories", activeCategoryId],
    queryFn: () => fetchSubcategories(activeCategoryId!),
    enabled: !!activeCategoryId
  });

  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ["brands", activeSubCategoryId],
    queryFn: () => fetchBrands(activeSubCategoryId!),
    enabled: !!activeSubCategoryId
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products", activeCategoryId, activeSubCategoryId, activeBrandId],
    queryFn: () => fetchProducts(
      activeCategoryId ?? undefined, 
      activeSubCategoryId ?? undefined,
      activeBrandId ?? undefined
    ),
    enabled: !!activeCategoryId
  });

  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  useEffect(() => {
    if (subcategories.length > 0 && !activeSubCategoryId) {
      setActiveSubCategoryId(subcategories[0].id);
    }
  }, [subcategories, activeSubCategoryId]);

  useEffect(() => {
    setActiveBrandId(null);
  }, [activeSubCategoryId]);

  const handleCategoryChange = (categoryId: number) => {
    setActiveCategoryId(categoryId);
    setActiveSubCategoryId(null);
    setActiveBrandId(null);
  };

  const handleSubcategoryChange = (subcategoryId: number) => {
    setActiveSubCategoryId(subcategoryId);
    setActiveBrandId(null);
  };

  const activeCategory = categories.find(c => c.id === activeCategoryId);
  const isVapeCategory = activeCategory?.slug === "vape";
  const hasBrands = brands.length > 0;

  if (categoriesLoading) {
    return (
      <section className="py-24 bg-white flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
      </section>
    );
  }

  return (
    <section id="catalog" className="pt-24 bg-cover bg-center bg-fixed min-h-screen relative" style={{ backgroundImage: "url('/assets/marble-bg.png')" }}>
      <div className="absolute inset-0 bg-white/40 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-arabic font-bold text-4xl text-[#0B281F] mb-4">تسوق حسب القسم</h2>
          <p className="font-serif text-[#D4AF37] text-xl tracking-widest">Our Collections</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || ShoppingBag;
            return (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  "group relative flex flex-col items-center justify-center w-24 h-28 md:w-32 md:h-36 transition-all duration-300 rounded-t-full border-b-4 shadow-lg",
                  activeCategoryId === cat.id 
                    ? "bg-[#0B281F] border-[#D4AF37] shadow-[0_10px_20px_rgba(11,40,31,0.3)] z-10 scale-105" 
                    : "bg-[#143D30] border-transparent hover:bg-[#0B281F] hover:-translate-y-1"
                )}
                whileTap={{ scale: 0.95 }}
              >
                <div className={cn(
                  "mb-2 transition-colors duration-300",
                  activeCategoryId === cat.id ? "text-[#D4AF37]" : "text-[#D4AF37]/70"
                )}>
                  <IconComponent className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                </div>
                <span className={cn(
                  "font-arabic font-bold text-sm md:text-base text-center transition-colors px-2 leading-tight",
                  activeCategoryId === cat.id ? "text-white" : "text-white/80"
                )}>
                  {cat.nameAr}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="relative pt-12 pb-20 bg-white/90 backdrop-blur-sm rounded-t-[80px] md:rounded-t-[150px] border-t-8 border-[#0B281F] shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-4 bg-[#D4AF37]/20 rounded-b-full blur-sm" />

        <div className="container mx-auto px-6">
          {isVapeCategory && activeCategoryId ? (
            <VapeCatalog
              categoryId={activeCategoryId}
              onBack={() => {
                if (categories.length > 0) {
                  handleCategoryChange(categories[0].id);
                }
              }}
            />
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 relative z-10">
                {subcategoriesLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                ) : (
                  <AnimatePresence mode="wait">
                    {subcategories.map((sub, idx) => (
                      <motion.button
                        key={`${activeCategoryId}-${sub.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleSubcategoryChange(sub.id)}
                        className={cn(
                          "px-6 py-2 rounded-full border-2 transition-all duration-300 font-arabic text-sm md:text-base font-medium min-w-[120px]",
                          activeSubCategoryId === sub.id
                            ? "bg-[#0B281F] text-[#D4AF37] border-[#D4AF37] shadow-lg scale-105"
                            : "bg-white text-gray-500 border-gray-200 hover:border-[#0B281F] hover:text-[#0B281F]"
                        )}
                      >
                        {sub.nameAr}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {hasBrands && (
                <div className="mb-12">
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    {brandsLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
                    ) : (
                      <AnimatePresence mode="wait">
                        {activeBrandId && (
                          <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setActiveBrandId(null)}
                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-2 font-arabic"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            كل الماركات
                          </motion.button>
                        )}
                        {brands.map((brand, idx) => (
                          <motion.button
                            key={`brand-${brand.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => setActiveBrandId(brand.id)}
                            className={cn(
                              "px-5 py-3 rounded-xl border-2 transition-all duration-300 font-arabic text-sm font-medium flex flex-col items-center gap-1 min-w-[100px]",
                              activeBrandId === brand.id
                                ? "bg-[#D4AF37] text-[#0B281F] border-[#D4AF37] shadow-lg scale-105"
                                : "bg-white text-gray-700 border-gray-200 hover:border-[#D4AF37] hover:text-[#0B281F]"
                            )}
                          >
                            <span className="font-bold">{brand.nameAr}</span>
                            {brand.price && (
                              <span className="text-xs opacity-80">{brand.price}</span>
                            )}
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12 min-h-[400px]">
                {productsLoading ? (
                  <div className="col-span-full flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
                  </div>
                ) : (
                  <>
                    <AnimatePresence mode="popLayout">
                      {products.map((product) => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className="group relative"
                        >
                          <div className="bg-white rounded-t-2xl rounded-b-md overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30 transform group-hover:-translate-y-2 z-10 relative">
                            <div className="absolute top-0 left-3 z-20">
                              <div className="w-8 h-24 bg-gradient-to-b from-[#D4AF37] to-[#B4941F] shadow-md flex flex-col items-center justify-center relative">
                                <div className="absolute bottom-0 left-0 right-0 h-4 bg-white" style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}></div>
                                <span className="block transform -rotate-90 text-[#0B281F] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap mb-2 origin-center translate-y-2">
                                  {product.badge}
                                </span>
                              </div>
                            </div>

                            <div className="h-[260px] w-[90%] mx-auto mt-4 rounded-lg bg-gradient-to-br from-[#F5F5F5] to-[#E0E0E0] relative overflow-hidden flex items-center justify-center p-6 shadow-inner border border-white/50">
                              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-50" />
                              <img 
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain relative z-10 mix-blend-multiply group-hover:scale-110 transition-transform duration-700 drop-shadow-xl" 
                              />
                            </div>

                            <div className="px-5 pt-4 pb-6 text-center bg-white relative">
                              <h3 className="font-serif font-bold text-lg text-[#0B281F] mb-1">{product.name}</h3>
                              <p className="font-sans text-[#D4AF37] font-bold text-lg mb-4">{product.price}</p>
                              
                              <Button 
                                onClick={() => addToCart(product)}
                                className="w-full bg-[#0B281F] text-[#D4AF37] hover:bg-[#143D30] font-serif tracking-wider uppercase rounded-md py-6 shadow-lg transition-all duration-300"
                                data-testid={`button-add-to-cart-${product.id}`}
                              >
                                إضافة للسلة
                              </Button>
                            </div>
                          </div>
                          
                          <div className="absolute -bottom-4 left-0 right-0 h-4 bg-[#0B281F] rounded-md shadow-lg transform scale-x-110 -z-0">
                            <div className="absolute top-0 w-full h-[1px] bg-[#D4AF37]/50" />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {products.length === 0 && !productsLoading && (
                      <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-20">
                        <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                        <p className="font-arabic text-lg">لا توجد منتجات حالياً في هذا القسم</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
