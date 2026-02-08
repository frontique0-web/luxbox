import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ShoppingBag,
  Loader2,
  ChevronLeft,
  Search,
  X
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchSubcategories, fetchBrands, fetchProducts, searchProducts } from "@/lib/api";
import type { Category, Subcategory, Brand, Product } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import VapeCatalog from "./VapeCatalog";

const CATEGORY_IMAGES: Record<string, string> = {
  perfumes: "/assets/categories/perfumes.png",
  makeup: "/assets/categories/makeup.png",
  watches: "/assets/categories/watches.png",
  accessories: "/assets/categories/accessories.png",
  bags: "/assets/categories/bags.png",
  "mobile-covers": "/assets/categories/mobile-covers.png",
  vape: "/assets/categories/vape.png",
};

export default function Catalog() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<number | null>(null);
  const [activeBrandId, setActiveBrandId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const isSearching = debouncedSearch.length > 0;
  const { addToCart } = useCart();
  const productsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const scrollToProducts = useCallback(() => {
    if (window.innerWidth < 768 && productsRef.current) {
      setTimeout(() => {
        const el = productsRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 220;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 200);
    }
  }, []);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ["searchProducts", debouncedSearch],
    queryFn: () => searchProducts(debouncedSearch),
    enabled: debouncedSearch.length > 0
  });

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearch("");
  };

  const handleCategoryChange = (categoryId: number) => {
    setActiveCategoryId(categoryId);
    setActiveSubCategoryId(null);
    setActiveBrandId(null);
    scrollToProducts();
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
        <div className="text-center mb-10">
          <h2 className="font-arabic font-bold text-4xl text-[#0B281F] mb-4">تسوق حسب القسم</h2>
          <p className="font-serif text-[#D4AF37] text-xl tracking-widest">Our Collections</p>
        </div>

        <div className="max-w-lg mx-auto mb-10">
          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full pr-12 pl-12 py-4 rounded-full border-2 border-gray-200 bg-white/90 backdrop-blur-sm font-arabic text-base text-[#0B281F] placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 shadow-md transition-all"
              dir="rtl"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {!isSearching && (
        <div className="flex md:flex-wrap md:justify-center gap-5 md:gap-6 mb-12 overflow-x-auto md:overflow-x-visible pt-3 pb-4 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-hide px-4 md:px-0" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>
          {categories.map((cat) => {
            const bgImage = CATEGORY_IMAGES[cat.slug] || "";
            const isActive = activeCategoryId === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  "group relative flex-shrink-0 snap-center flex flex-col items-center justify-end w-[130px] h-[170px] md:w-[155px] md:h-[200px] transition-all duration-300 overflow-hidden shadow-lg",
                  "rounded-t-full rounded-b-lg",
                  isActive
                    ? "ring-2 ring-[#D4AF37] shadow-[0_10px_25px_rgba(212,175,55,0.3)] z-10 scale-105" 
                    : "hover:shadow-xl hover:-translate-y-1"
                )}
                whileTap={{ scale: 0.95 }}
              >
                {bgImage && (
                  <img 
                    src={bgImage} 
                    alt={cat.nameAr} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                
                <div className={cn(
                  "absolute inset-0 transition-all duration-300",
                  isActive
                    ? "bg-[#143D30]/65" 
                    : "bg-[#1a4a3a]/50 group-hover:bg-[#143D30]/60"
                )} />

                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-4">
                  <span className={cn(
                    "font-arabic font-bold text-lg md:text-xl text-center transition-all leading-tight drop-shadow-lg",
                    isActive ? "text-[#D4AF37]" : "text-white"
                  )}>
                    {cat.nameAr}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="categoryIndicator"
                      className="w-10 h-[2px] bg-[#D4AF37] mt-3 rounded-full"
                    />
                  )}
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B4941F] via-[#D4AF37] to-[#B4941F] rounded-b-lg" />
                )}
              </motion.button>
            );
          })}
        </div>
        )}

      </div>

        {isSearching ? (
          <div ref={productsRef} className="relative pt-12 pb-20 bg-white/90 backdrop-blur-sm rounded-t-[40px] md:rounded-t-[80px] border-t-4 border-[#D4AF37] shadow-2xl mt-8 overflow-hidden">
            <div className="container mx-auto px-6">
              <div className="text-center mb-8">
                <p className="font-arabic text-lg text-gray-500">
                  نتائج البحث عن: <span className="text-[#0B281F] font-bold">"{debouncedSearch}"</span>
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12 min-h-[200px]">
                {searchLoading ? (
                  <div className="col-span-full flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-20">
                    <Search className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-arabic text-lg">لا توجد نتائج للبحث</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {searchResults.map((product) => (
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
                            >
                              إضافة للسلة
                            </Button>
                          </div>
                        </div>
                        
                        <div className="absolute -bottom-4 left-0 right-0 h-4 bg-[#0B281F] rounded-md shadow-lg transform scale-x-110 -z-0">
                          <div className="absolute top-0 w-full h-[1px] bg-[#D4AF37]/50 rounded-md" />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        ) : (
      <div ref={productsRef} className="relative pt-12 pb-20 bg-white/90 backdrop-blur-sm rounded-t-[80px] md:rounded-t-[150px] border-t-8 border-[#0B281F] shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-4 bg-[#D4AF37]/20 blur-sm rounded-t-[80px] md:rounded-t-[150px]" />

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
                            <div className="absolute top-0 w-full h-[1px] bg-[#D4AF37]/50 rounded-md" />
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
        )}
    </section>
  );
}
