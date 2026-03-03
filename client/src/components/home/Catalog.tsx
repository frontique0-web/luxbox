import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  X
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchSubcategories, fetchProducts, searchProducts } from "@/lib/api";
import type { Product, Category, Subcategory } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import VapeCatalog from "./VapeCatalog";
import { useSettings, formatPrice } from "@/hooks/use-settings";

const CATEGORY_IMAGES: Record<string, string> = {
  perfumes: "/assets/categories/perfumes.png",
  makeup_care: "/assets/categories/makeup.png",
  watches: "/assets/categories/watches.png",
  accessories: "/assets/categories/accessories.png",
  bags: "/assets/categories/bags.png",
  mobile: "/assets/categories/mobile-covers.png",
  vape: "/assets/categories/vape.png",
};

function ProductsGrid({
  products,
  loading,
  addToCart
}: {
  products: Product[],
  loading: boolean,
  addToCart: (product: Product) => void
}) {
  const { currency, exchangeRate } = useSettings();

  if (loading) {
    return (
      Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="group relative">
          <div className="bg-white rounded-t-2xl rounded-b-md overflow-hidden shadow-xl border border-gray-100 z-10 relative">
            <div className="h-[260px] w-[90%] mx-auto mt-4 rounded-lg bg-gray-100 relative overflow-hidden p-6 animate-pulse" />
            <div className="px-5 pt-4 pb-6 text-center bg-white relative">
              <Skeleton className="h-6 w-3/4 mx-auto mb-2 bg-gray-200" />
              <Skeleton className="h-6 w-1/2 mx-auto mb-4 bg-gray-200" />
              <Skeleton className="h-14 w-full rounded-md bg-gray-200" />
            </div>
          </div>
        </div>
      ))
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-20">
        <Search className="w-16 h-16 mb-4 opacity-20" />
        <p className="font-arabic text-lg">لا توجد منتجات لعرضها</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          layout
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            duration: 0.4,
            delay: index * 0.06,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="group relative"
        >
          <div className="bg-white rounded-t-2xl rounded-b-md overflow-hidden shadow-xl border border-gray-100 z-10 relative hover:shadow-2xl transition-shadow duration-300">
            <div className="h-[260px] w-[90%] mx-auto mt-4 rounded-lg bg-gray-100 relative overflow-hidden p-6">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="px-5 pt-4 pb-6 text-center bg-white relative">
              <h3 className="font-arabic text-lg font-semibold text-[#0B281F] mb-1">
                {product.name}
              </h3>
              <p className="font-serif text-sm text-[#D4AF37] mb-1">
                {formatPrice(product.price, currency, exchangeRate)}
              </p>
              <p className="text-gray-400 text-xs font-sans mb-4" dir="ltr">
                الرمز: {product.code}
              </p>
              <motion.div whileTap={{ scale: 0.93 }}>
                <Button
                  onClick={() => addToCart(product)}
                  className="w-full bg-[#D4AF37] hover:bg-[#B4941F] text-white font-arabic text-base py-3 rounded-md shadow-md transition-all duration-300 flex items-center justify-center"
                >
                  <ShoppingBag className="w-5 h-5 ml-2" />
                  أضف إلى السلة
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

export default function Catalog() {
  const { currency, exchangeRate } = useSettings();
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const isSearching = debouncedSearch.length > 0;
  const { addToCart } = useCart();
  const productsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 200;
      categoriesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products", activeCategoryId, activeSubCategoryId],
    queryFn: () => fetchProducts(
      activeCategoryId ?? undefined,
      activeSubCategoryId ?? undefined
    ),
    enabled: !!activeCategoryId
  });

  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  // Auto-scroll categories container every 5 seconds (visual scroll only, no category change)
  useEffect(() => {
    if (!isAutoScrolling) return;

    const intervalId = setInterval(() => {
      const el = categoriesScrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return; // no scroll needed
      if (el.scrollLeft >= maxScroll - 10) {
        // reset to start
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 180, behavior: 'smooth' });
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isAutoScrolling]);



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
    setIsAutoScrolling(false);
    setActiveCategoryId(categoryId);
    setActiveSubCategoryId(null);
    scrollToProducts();
    // Resume auto-scroll after 8 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 8000);
  };

  const handleSubcategoryChange = (subcategoryId: number) => {
    setActiveSubCategoryId(subcategoryId);
  };

  const activeCategory = categories.find(c => c.id === activeCategoryId);
  const isVapeCategory = activeCategory?.slug === "vape";

  // Hide the global loading screen only when initial data is ready
  useEffect(() => {
    if (!categoriesLoading && categories.length > 0 && !productsLoading) {
      if (typeof window !== "undefined" && (window as any).hideLuxLoader) {
        (window as any).hideLuxLoader();
      }
    }
  }, [categoriesLoading, productsLoading, categories.length]);

  if (categoriesLoading) {
    return (
      <section className="py-24 bg-white flex flex-col items-center justify-center min-h-screen relative" style={{ backgroundImage: "url('/assets/marble-bg.png')" }}>
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
          <Skeleton className="w-64 h-10 mb-4 bg-gray-200" />
          <Skeleton className="w-48 h-6 mb-10 bg-gray-200" />
          <div className="flex lg:flex-wrap lg:justify-center gap-5 lg:gap-6 w-full overflow-hidden px-4 lg:px-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="flex-shrink-0 w-[200px] h-[260px] lg:w-[155px] lg:h-[200px] rounded-t-full rounded-b-lg bg-gray-200" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="catalog" className="pt-8 lg:pt-24 bg-cover bg-center bg-fixed min-h-screen relative" style={{ backgroundImage: "url('/assets/marble-bg.png')" }}>
      <div className="absolute inset-0 bg-white/40 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <div className="max-w-lg mx-auto mb-8 mt-2 lg:mt-6">
          <label className="block text-[#0B281F] font-arabic font-bold text-lg mb-3 text-center">
            ابحث عن منتج أو أدخل كود المنتج هنا
          </label>
          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full pr-12 pl-12 py-4 rounded-full border-2 border-gray-200 bg-white/95 font-arabic text-base text-[#0B281F] placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 shadow-md transition-all"
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

        <div className="flex justify-center items-center mb-6">
          <h2 className="font-arabic font-bold text-2xl text-[#0B281F]">الأقسام</h2>
        </div>

        {!isSearching && (
          <div className="relative group/categories mb-12 w-full overflow-hidden">
            {/* Desktop Layout: horizontally scrollable row */}
            <div
              ref={categoriesScrollRef}
              className="hidden lg:flex py-6 items-center justify-start gap-6 flex-nowrap w-full px-8 overflow-x-auto scrollbar-hide"
              dir="ltr"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseEnter={() => setIsAutoScrolling(false)}
              onMouseLeave={() => setIsAutoScrolling(true)}
            >
              {categories.map((cat, idx) => {
                const bgImage = cat.imageUrl || CATEGORY_IMAGES[cat.slug] || "";
                const isActive = activeCategoryId === cat.id;
                return (
                  <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={cn(
                      "relative flex-shrink flex-grow-0 flex flex-col items-center justify-end w-[20%] max-w-[160px] aspect-[2/3] transition-all duration-300 overflow-hidden shadow-sm",
                      "rounded-2xl",
                      isActive
                        ? "ring-2 ring-[#0B281F] shadow-lg shadow-[#0B281F]/30 z-10 scale-105"
                        : "hover:shadow-md hover:scale-105"
                    )}
                    whileTap={{ scale: 0.95 }}
                    style={{ backgroundColor: bgImage ? 'transparent' : '#f3e8eb' }}
                  >
                    {bgImage && (
                      <img
                        src={bgImage}
                        alt={cat.nameAr}
                        className="absolute inset-0 w-full h-full object-cover origin-center transition-transform duration-700 hover:scale-110"
                      />
                    )}

                    <div className={cn(
                      "absolute inset-0 transition-all duration-500",
                      isActive ? "bg-black/10" : "bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"
                    )} />

                    <div className="relative z-10 w-full py-2 px-1 text-center pb-3">
                      <span className={cn(
                        "font-arabic font-bold text-sm lg:text-base leading-tight block w-full transition-all drop-shadow-md",
                        isActive ? "text-[#D4AF37]" : "text-white"
                      )}>
                        {cat.nameAr}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Mobile Layout (Hidden on desktop): Original scrollable row */}
            <div
              className="lg:hidden relative"
              onMouseEnter={() => setIsAutoScrolling(false)}
              onMouseLeave={() => setIsAutoScrolling(true)}
              onTouchStart={() => setIsAutoScrolling(false)}
              onTouchEnd={() => setIsAutoScrolling(true)}
            >


              <div
                ref={categoriesScrollRef}
                className="flex gap-5 overflow-x-auto pt-3 pb-4 snap-x snap-mandatory scrollbar-hide px-5"
                style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.map((cat) => {
                  const bgImage = cat.imageUrl || CATEGORY_IMAGES[cat.slug] || "";
                  const isActive = activeCategoryId === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={cn(
                        "relative flex-shrink-0 snap-center flex flex-col items-center justify-end w-[155px] aspect-[3/5] transition-all duration-300 overflow-hidden shadow-sm",
                        "rounded-xl",
                        isActive
                          ? "ring-2 ring-[#0B281F] shadow-lg shadow-[#0B281F]/30 z-10 scale-105"
                          : "hover:shadow-md hover:-translate-y-1"
                      )}
                      whileTap={{ scale: 0.95 }}
                      style={{ backgroundColor: bgImage ? 'transparent' : '#f3e8eb' }}
                    >
                      {bgImage && (
                        <img
                          src={bgImage}
                          alt={cat.nameAr}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
                        />
                      )}

                      <div className={cn(
                        "absolute inset-0 transition-all duration-300",
                        isActive ? "bg-black/10" : "bg-black/20"
                      )} />

                      <div className="relative z-10 w-full bg-white/95 py-3 px-2 border-t border-white/40 shadow-sm">
                        <span className={cn(
                          "font-arabic font-bold text-sm text-center block w-full transition-all",
                          isActive ? "text-[#D4AF37]" : "text-[#0B281F]"
                        )}>
                          {cat.nameAr}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>


            </div>
          </div>
        )}

      </div>

      {isSearching ? (
        <div ref={productsRef} className="relative pt-12 pb-20 bg-[#0B281F] rounded-t-[40px] lg:rounded-t-[80px] border-t-4 border-[#D4AF37] shadow-2xl mt-8 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_90%,rgba(255,255,255,0.02)_100%)] bg-[length:100%_12px] pointer-events-none mix-blend-screen" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#04120e]/60 pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-8">
              <p className="font-arabic text-lg text-gray-400">
                نتائج البحث عن: <span className="text-white font-bold">"{debouncedSearch}"</span>
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-4 gap-y-12 min-h-[200px]">
              {searchLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="group relative">
                    <div className="bg-white rounded-t-2xl rounded-b-md overflow-hidden shadow-xl border border-gray-100 z-10 relative">
                      <div className="h-[260px] w-[90%] mx-auto mt-4 rounded-lg bg-gray-100 relative overflow-hidden p-6 animate-pulse" />
                      <div className="px-5 pt-4 pb-6 text-center bg-white relative">
                        <Skeleton className="h-6 w-3/4 mx-auto mb-2 bg-gray-200" />
                        <Skeleton className="h-6 w-1/2 mx-auto mb-4 bg-gray-200" />
                        <Skeleton className="h-14 w-full rounded-md bg-gray-200" />
                      </div>
                    </div>
                  </div>
                ))
              ) : searchResults.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-20">
                  <Search className="w-16 h-16 mb-4 opacity-20 text-white" />
                  <p className="font-arabic text-lg text-white">لا توجد نتائج للبحث</p>
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
                      className="group relative h-full"
                    >
                      <Link href={`/product/${product.id}`} className="block h-full group relative">
                        <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 z-10 relative flex flex-col h-full">

                          {product.badge && (
                            <div className="absolute top-4 right-4 z-20">
                              <div className="bg-[#D4AF37] px-2 py-1 rounded shadow-sm">
                                <span className="text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                  {product.badge}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="aspect-[4/5] w-full bg-[#fcfcfc] relative overflow-hidden flex items-center justify-center p-4">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          <div className="px-4 pt-4 pb-5 text-right bg-white relative flex-grow flex flex-col justify-between">
                            <div>
                              <h3 className="font-arabic font-medium text-sm lg:text-base text-gray-800 mb-2 line-clamp-2 leading-snug">{product.name}</h3>
                            </div>

                            <div className="mt-auto">
                              <div className="flex justify-start items-center gap-2">
                                <span className="font-sans text-gray-600 font-bold text-sm lg:text-base">{formatPrice(product.price, currency, exchangeRate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div ref={productsRef} className="relative pt-12 pb-20 bg-[#0B281F] rounded-t-[80px] lg:rounded-t-[150px] border-t-8 border-[#D4AF37] shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_90%,rgba(255,255,255,0.02)_100%)] bg-[length:100%_12px] pointer-events-none mix-blend-screen" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#04120e]/60 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-4 bg-[#D4AF37]/20 blur-sm rounded-t-[80px] lg:rounded-t-[150px] z-10" />

          <div className="container mx-auto px-6 relative z-10">
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
                {/* ── Luxury Inline Text Navigation ── */}
                {(subcategoriesLoading || subcategories.length > 0) && (
                  <div className="mb-14 relative z-10 w-full">

                    {/* Decorative top rule */}
                    <div className="flex items-center gap-4 mb-6 px-8 max-w-2xl mx-auto">
                      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3))' }} />
                      <span className="text-[#D4AF37]/40 text-xs tracking-[0.3em] font-arabic">التصنيفات</span>
                      <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, transparent, rgba(212,175,55,0.3))' }} />
                    </div>

                    {subcategoriesLoading ? (
                      <div className="flex justify-center gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-6 w-24 bg-white/10 rounded" />
                        ))}
                      </div>
                    ) : (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeCategoryId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex flex-wrap items-center justify-center gap-y-4"
                          dir="rtl"
                        >
                          {/* الكل */}
                          {subcategories.length > 0 && (() => {
                            const isAll = activeSubCategoryId === null;
                            return (
                              <div key="nav-all" className="flex items-center">
                                <button
                                  onClick={() => handleSubcategoryChange(null as any)}
                                  className="relative px-5 py-1.5 group"
                                >
                                  <span
                                    className="font-arabic font-bold transition-all duration-300 block"
                                    style={{
                                      fontSize: isAll ? '1rem' : '0.875rem',
                                      color: isAll ? '#D4AF37' : 'rgba(255,255,255,0.45)',
                                      letterSpacing: isAll ? '0.04em' : '0',
                                    }}
                                  >
                                    الكل
                                  </span>
                                  {/* Animated gold underline */}
                                  {isAll && (
                                    <motion.div
                                      layoutId="luxUnderline"
                                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                                      transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                                      style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
                                    />
                                  )}
                                </button>
                                {/* Diamond separator */}
                                <span className="text-[#D4AF37]/25 text-xs select-none px-1">◆</span>
                              </div>
                            );
                          })()}

                          {/* Individual subcategories */}
                          {subcategories.map((sub, idx) => {
                            const isActive = activeSubCategoryId === sub.id;
                            const isLast = idx === subcategories.length - 1;
                            return (
                              <div key={`nav-${activeCategoryId}-${sub.id}`} className="flex items-center">
                                <motion.button
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                                  onClick={() => handleSubcategoryChange(sub.id)}
                                  className="relative px-5 py-1.5 group"
                                >
                                  <span
                                    className="font-arabic font-bold transition-all duration-300 block"
                                    style={{
                                      fontSize: isActive ? '1rem' : '0.875rem',
                                      color: isActive ? '#D4AF37' : 'rgba(255,255,255,0.45)',
                                      letterSpacing: isActive ? '0.04em' : '0',
                                    }}
                                  >
                                    {sub.nameAr}
                                  </span>
                                  {/* Animated gold underline */}
                                  {isActive && (
                                    <motion.div
                                      layoutId="luxUnderline"
                                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                                      transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                                      style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
                                    />
                                  )}
                                </motion.button>
                                {/* Diamond separator (not after last) */}
                                {!isLast && (
                                  <span className="text-[#D4AF37]/25 text-xs select-none px-1">◆</span>
                                )}
                              </div>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Decorative bottom rule */}
                    <div className="flex items-center mt-6 px-8 max-w-2xl mx-auto">
                      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)' }} />
                    </div>
                  </div>
                )}





                <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-4 gap-y-12 min-h-[400px]">
                  {productsLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="group relative">
                        <div className="bg-white rounded-t-2xl rounded-b-md overflow-hidden shadow-xl border border-gray-100 z-10 relative">
                          <div className="h-[260px] w-[90%] mx-auto mt-4 rounded-lg bg-gray-100 relative overflow-hidden p-6 animate-pulse" />
                          <div className="px-5 pt-4 pb-6 text-center bg-white relative">
                            <Skeleton className="h-6 w-3/4 mx-auto mb-2 bg-gray-200" />
                            <Skeleton className="h-6 w-1/2 mx-auto mb-4 bg-gray-200" />
                            <Skeleton className="h-14 w-full rounded-md bg-gray-200" />
                          </div>
                        </div>
                      </div>
                    ))
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
                            className="group relative h-full"
                          >
                            <Link href={`/product/${product.id}`} className="block h-full group relative">
                              <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 z-10 relative flex flex-col h-full">

                                {product.badge && (
                                  <div className="absolute top-4 right-4 z-20">
                                    <div className="bg-[#D4AF37]/90 backdrop-blur-sm px-2 py-1 rounded border border-[#D4AF37]/30 shadow-sm">
                                      <span className="text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                        {product.badge}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                <div className="aspect-[4/5] w-full bg-[#fcfcfc] relative overflow-hidden flex items-center justify-center p-4">
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>

                                <div className="px-5 pt-6 pb-6 text-center bg-white relative flex-grow flex flex-col justify-between">
                                  <div>
                                    <h3 className="font-serif font-bold text-lg lg:text-xl text-[#0B281F] mb-1 line-clamp-2">{product.name}</h3>
                                    {product.description && (
                                      <p className="font-arabic text-xs text-gray-500 mb-3 line-clamp-1 leading-relaxed">
                                        {product.description}
                                      </p>
                                    )}
                                  </div>

                                  <div className="mt-auto pt-2 border-t border-gray-50">
                                    <div className="flex justify-center items-center gap-2">
                                      <span className="font-sans text-[#D4AF37] font-bold text-lg">{formatPrice(product.price, currency, exchangeRate)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="absolute -bottom-2 left-4 right-4 h-4 bg-[#D4AF37]/20 blur-xl rounded-full -z-10 group-hover:bg-[#D4AF37]/40 transition-colors duration-500" />
                            </Link>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {products.length === 0 && !productsLoading && (
                        <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-20">
                          <ShoppingBag className="w-16 h-16 mb-4 opacity-20 text-white" />
                          <p className="font-arabic text-lg text-white">لا توجد منتجات حالياً في هذا القسم</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div >
      )
      }
    </section >
  );
}

