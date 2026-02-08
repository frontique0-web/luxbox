import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Loader2,
  ChevronRight,
  ChevronLeft,
  Droplets,
  Cigarette,
  Wind,
  Disc3,
  Box,
  FlaskConical,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubcategories, fetchBrands, fetchProducts } from "@/lib/api";
import type { Subcategory, Brand, Product } from "@shared/schema";
import { useCart } from "@/context/CartContext";

const VAPE_ICON_MAP: Record<string, any> = {
  "جوسات": Droplets,
  "سحبات السيكارة": Cigarette,
  "سحبات الأركيلة": Wind,
  "Coil": Disc3,
  "Pod": Box,
  "Tank": FlaskConical,
};

const VAPE_DESC_MAP: Record<string, string> = {
  "جوسات": "تشكيلة واسعة من الجوسات بمختلف الأحجام والنكهات",
  "سحبات السيكارة": "سحبات إلكترونية بأفضل الماركات العالمية",
  "سحبات الأركيلة": "سحبات أركيلة بنكهات مميزة وعدد سحبات عالي",
  "Coil": "كويلات لجميع أنواع الأجهزة",
  "Pod": "بودات متنوعة لأجهزة الفيب",
  "Tank": "تانكات احترافية بأفضل الأنواع",
};

interface VapeCatalogProps {
  categoryId: number;
  onBack: () => void;
}

type ViewState = "subcategories" | "brands" | "products";

export default function VapeCatalog({ categoryId, onBack }: VapeCatalogProps) {
  const [viewState, setViewState] = useState<ViewState>("subcategories");
  const [activeSubId, setActiveSubId] = useState<number | null>(null);
  const [activeBrandId, setActiveBrandId] = useState<number | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(["الأراكيل والفيب"]);
  const { addToCart } = useCart();

  const { data: subcategories = [], isLoading: subsLoading } = useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => fetchSubcategories(categoryId),
  });

  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ["brands", activeSubId],
    queryFn: () => fetchBrands(activeSubId!),
    enabled: !!activeSubId,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products", categoryId, activeSubId, activeBrandId],
    queryFn: () =>
      fetchProducts(
        categoryId,
        activeSubId ?? undefined,
        activeBrandId ?? undefined
      ),
    enabled: viewState === "products" && !!activeSubId,
  });

  const [skipBrands, setSkipBrands] = useState(false);

  useEffect(() => {
    if (viewState === "brands" && !brandsLoading && brands.length === 0 && activeSubId) {
      setSkipBrands(true);
      setViewState("products");
    }
  }, [viewState, brandsLoading, brands.length, activeSubId]);

  const handleSubClick = (sub: Subcategory) => {
    setActiveSubId(sub.id);
    setActiveBrandId(null);
    setBreadcrumb(["الأراكيل والفيب", sub.nameAr]);
    setViewState("brands");
    setSkipBrands(false);
  };

  const handleBrandClick = (brand: Brand) => {
    setActiveBrandId(brand.id);
    setBreadcrumb((prev) => [...prev.slice(0, 2), brand.nameAr]);
    setViewState("products");
  };

  const handleBack = () => {
    if (viewState === "products" && skipBrands) {
      setActiveSubId(null);
      setActiveBrandId(null);
      setBreadcrumb(["الأراكيل والفيب"]);
      setViewState("subcategories");
      setSkipBrands(false);
      return;
    }
    if (viewState === "products") {
      setActiveBrandId(null);
      setBreadcrumb((prev) => prev.slice(0, 2));
      setViewState("brands");
    } else if (viewState === "brands") {
      setActiveSubId(null);
      setActiveBrandId(null);
      setBreadcrumb(["الأراكيل والفيب"]);
      setViewState("subcategories");
    } else {
      onBack();
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setActiveSubId(null);
      setActiveBrandId(null);
      setSkipBrands(false);
      setBreadcrumb(["الأراكيل والفيب"]);
      setViewState("subcategories");
    } else if (index === 1 && !skipBrands) {
      setActiveBrandId(null);
      setBreadcrumb((prev) => prev.slice(0, 2));
      setViewState("brands");
    }
  };

  return (
    <div className="min-h-[600px]">
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-[#0B281F] hover:text-[#D4AF37] transition-colors font-arabic text-sm"
        >
          <ChevronRight className="w-4 h-4" />
          رجوع
        </button>
        <div className="flex items-center gap-2 text-sm font-arabic">
          {breadcrumb.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {idx > 0 && (
                <ChevronLeft className="w-3 h-3 text-gray-400" />
              )}
              <button
                onClick={() => handleBreadcrumbClick(idx)}
                className={cn(
                  "transition-colors",
                  idx === breadcrumb.length - 1
                    ? "text-[#D4AF37] font-bold"
                    : "text-gray-500 hover:text-[#0B281F]"
                )}
              >
                {crumb}
              </button>
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewState === "subcategories" && (
          <motion.div
            key="subcategories"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-arabic font-bold text-2xl text-[#0B281F] text-center mb-2">
              اختر القسم
            </h3>
            <p className="font-serif text-[#D4AF37] text-center mb-10 tracking-widest text-sm">
              Select Category
            </p>

            {subsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {subcategories.map((sub, idx) => {
                  const IconComp =
                    VAPE_ICON_MAP[sub.nameAr] || ShoppingBag;
                  const desc =
                    VAPE_DESC_MAP[sub.nameAr] || "تصفح المنتجات";
                  return (
                    <motion.button
                      key={sub.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      onClick={() => handleSubClick(sub)}
                      className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 hover:border-[#D4AF37] bg-white shadow-lg hover:shadow-2xl transition-all duration-500 p-6 text-right"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#0B281F] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0B281F] to-[#143D30] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                          <IconComp
                            className="w-8 h-8 text-[#D4AF37]"
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-arabic font-bold text-lg text-[#0B281F] group-hover:text-[#D4AF37] transition-colors mb-1">
                            {sub.nameAr}
                          </h4>
                          <p className="font-arabic text-xs text-gray-400 leading-relaxed">
                            {desc}
                          </p>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-[#D4AF37] transition-colors shrink-0" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {viewState === "brands" && (
          <motion.div
            key="brands"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-arabic font-bold text-2xl text-[#0B281F] text-center mb-2">
              {subcategories.find((s) => s.id === activeSubId)?.nameAr}
            </h3>
            <p className="font-serif text-[#D4AF37] text-center mb-10 tracking-widest text-sm">
              اختر الماركة أو النوع
            </p>

            {brandsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
              </div>
            ) : brands.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {brands.map((brand, idx) => (
                  <motion.button
                    key={brand.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleBrandClick(brand)}
                    className="group relative overflow-hidden rounded-xl border-2 border-gray-100 hover:border-[#D4AF37] bg-white shadow-md hover:shadow-xl transition-all duration-400 p-5 text-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B281F]/0 to-[#0B281F]/5 group-hover:to-[#D4AF37]/10 transition-all duration-500" />

                    {brand.imageUrl && (
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img
                          src={brand.imageUrl}
                          alt={brand.nameAr}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    <h4 className="font-bold text-[#0B281F] group-hover:text-[#D4AF37] transition-colors text-sm mb-1 relative z-10">
                      {brand.nameAr}
                    </h4>

                    {brand.puffs && (
                      <div className="flex items-center justify-center gap-1 mt-2 relative z-10">
                        <Zap className="w-3 h-3 text-[#D4AF37]" />
                        <span className="text-xs text-gray-500 font-medium">
                          {parseInt(brand.puffs).toLocaleString()} سحبة
                        </span>
                      </div>
                    )}

                    {brand.price && (
                      <p className="text-xs text-[#D4AF37] font-bold mt-1 relative z-10">
                        {brand.price}
                      </p>
                    )}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
              </div>
            )}
          </motion.div>
        )}

        {viewState === "products" && (
          <motion.div
            key="products"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {skipBrands ? (
              <>
                <h3 className="font-arabic font-bold text-2xl text-[#0B281F] text-center mb-2">
                  {subcategories.find((s) => s.id === activeSubId)?.nameAr}
                </h3>
                <p className="font-serif text-[#D4AF37] text-center mb-10 tracking-widest text-sm">
                  اختر المنتج
                </p>
              </>
            ) : (
              <>
                <h3 className="font-arabic font-bold text-2xl text-[#0B281F] text-center mb-2">
                  {brands.find((b) => b.id === activeBrandId)?.nameAr}
                </h3>
                {brands.find((b) => b.id === activeBrandId)?.puffs && (
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-arabic text-sm text-gray-500">
                      {parseInt(
                        brands.find((b) => b.id === activeBrandId)?.puffs || "0"
                      ).toLocaleString()}{" "}
                      سحبة
                    </span>
                  </div>
                )}
                <p className="font-serif text-[#D4AF37] text-center mb-10 tracking-widest text-sm">
                  اختر المنتج
                </p>
              </>
            )}

            <ProductsGrid
              products={products}
              loading={productsLoading}
              addToCart={addToCart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductsGrid({
  products,
  loading,
  addToCart,
}: {
  products: Product[];
  loading: boolean;
  addToCart: (product: Product) => void;
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 py-20">
        <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
        <p className="font-arabic text-lg">لا توجد منتجات حالياً</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
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
                  <div
                    className="absolute bottom-0 left-0 right-0 h-4 bg-white"
                    style={{
                      clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                    }}
                  ></div>
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
                <h3 className="font-serif font-bold text-lg text-[#0B281F] mb-1">
                  {product.name}
                </h3>
                <p className="font-sans text-[#D4AF37] font-bold text-lg mb-4">
                  {product.price}
                </p>

                <Button
                  onClick={() => addToCart(product)}
                  className="w-full bg-[#0B281F] text-[#D4AF37] hover:bg-[#143D30] font-serif tracking-wider uppercase rounded-md py-6 shadow-lg transition-all duration-300"
                >
                  إضافة للسلة
                </Button>
              </div>
            </div>

            <div className="absolute -bottom-4 left-0 right-0 h-4 bg-[#0B281F] rounded-md shadow-lg transform scale-x-110 -z-0 overflow-hidden">
              <div className="absolute top-0 w-full h-[1px] bg-[#D4AF37]/50 rounded-md" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
