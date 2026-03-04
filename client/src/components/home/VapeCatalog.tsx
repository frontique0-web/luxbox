import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
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
import { fetchSubcategories, fetchProducts } from "@/lib/api";
import type { Subcategory, Product } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import { useSettings, formatPrice } from "@/hooks/use-settings";

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

type ViewState = "subcategories" | "products";

export default function VapeCatalog({ categoryId, onBack }: VapeCatalogProps) {
  const [viewState, setViewState] = useState<ViewState>("subcategories");
  const [activeSubId, setActiveSubId] = useState<number | null>(null);
  const { addToCart } = useCart();

  const { data: subcategories = [], isLoading: subsLoading } = useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => fetchSubcategories(categoryId),
  });
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products", categoryId, activeSubId],
    queryFn: () => fetchProducts(categoryId, activeSubId ?? undefined),
    enabled: viewState === "products" && !!activeSubId,
  });

  const handleSubClick = (sub: Subcategory) => {
    setActiveSubId(sub.id);
    setViewState("products");
  };

  const handleBack = () => {
    if (viewState === "products") {
      setActiveSubId(null);
      setViewState("subcategories");
    } else {
      onBack();
    }
  };

  const handleTitleClick = () => {
    setActiveSubId(null);
    setViewState("subcategories");
  };

  return (
    <div className="min-h-[600px] relative z-10">
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-[#0B281F] hover:text-[#D4AF37] transition-colors font-arabic text-sm"
        >
          <ChevronRight className="w-4 h-4" />
          رجوع
        </button>
        <div className="flex items-center gap-2 text-sm font-arabic">
          <button
            onClick={handleTitleClick}
            className={cn(
              "hover:text-[#D4AF37] transition-colors",
              viewState === "subcategories" ? "text-[#D4AF37] font-medium" : "text-gray-400"
            )}
          >
            الأراكيل والفيب
          </button>
          {activeSubId && viewState === "products" && (
            <>
              <ChevronLeft className="w-3 h-3 text-gray-400 mt-1" />
              <span className="text-[#D4AF37] font-medium">
                {subcategories.find(s => s.id === activeSubId)?.nameAr}
              </span>
            </>
          )}
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

        {viewState === "products" && (
          <motion.div
            key="products"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-arabic font-bold text-2xl text-[#0B281F] text-center mb-2">
              {subcategories.find((s) => s.id === activeSubId)?.nameAr}
            </h3>
            <p className="font-serif text-[#D4AF37] text-center mb-10 tracking-widest text-sm">
              اختر المنتج
            </p>

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
  const { currency, exchangeRate } = useSettings();

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-12">
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
            <Link href={`/product/${product.id}`} className="block h-full group relative">
              <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-[2px] border-[#D4AF37] z-10 relative flex flex-col h-full">

                <div className="aspect-[4/5] w-full bg-[#fcfcfc] relative overflow-hidden flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="px-5 pt-4 pb-4 text-center bg-white relative flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg md:text-xl text-[#0B281F] mb-1 line-clamp-2">{product.name}</h3>
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

              <div className="absolute -bottom-2 left-4 right-4 h-4 rounded-full -z-10 shadow-[0_15px_30px_-5px_#D4AF3750] group-hover:shadow-[0_20px_40px_-5px_#D4AF3770] transition-shadow duration-500" />
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
