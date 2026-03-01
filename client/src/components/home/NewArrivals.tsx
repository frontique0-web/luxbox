import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchProducts } from "@/lib/api";
import { useSettings, formatPrice } from "@/hooks/use-settings";
import { useCart } from "@/context/CartContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewArrivals() {
    const { data: allProducts, isLoading } = useQuery({
        queryKey: ["all-products-new-arrivals"],
        queryFn: () => fetchProducts(),
    });

    const { currency, exchangeRate } = useSettings();
    const { addToCart } = useCart();

    // Pick the most recent 10 products
    const newProducts = allProducts ? [...allProducts].reverse().slice(0, 10) : [];

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = window.innerWidth > 768 ? 600 : 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (isLoading) {
        return (
            <section className="py-12 bg-white overflow-hidden">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                        <h2 className="font-arabic font-bold text-2xl text-[#0B281F]">وصلنا حديثاً</h2>
                        <span className="text-gray-400 font-arabic text-sm">المزيد</span>
                    </div>
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-4 scrollbar-hide">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="min-w-[280px] md:min-w-[320px] bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 h-64 relative shrink-0 snap-start">
                                <Skeleton className="w-full h-full absolute inset-0 bg-gray-100/50" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (newProducts.length === 0) return null;

    return (
        <section id="new-arrivals" className="py-12 bg-white overflow-hidden">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                    <h2 className="font-arabic font-bold text-2xl text-[#0B281F]">وصلنا حديثاً</h2>
                    <Link href="/?category=all" className="text-[#D4AF37] hover:text-[#D4AF37] font-arabic text-sm font-bold transition-colors">
                        المزيد
                    </Link>
                </div>

                <div className="relative group/arrivals mb-6">
                    {/* Right Scroll Button */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#0B281F] hover:bg-[#D4AF37] hover:text-white transition-all border border-gray-100 z-20 opacity-0 group-hover/arrivals:opacity-100 group-focus-within/arrivals:opacity-100 sm:opacity-100 pointer-events-auto"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                        <AnimatePresence>
                            {newProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="group relative h-full min-w-[260px] md:min-w-[280px] w-[260px] md:w-[280px] shrink-0 snap-center md:snap-start"
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
                                        <div className="absolute -bottom-2 left-4 right-4 h-4 bg-[#D4AF37]/20 blur-xl rounded-full -z-10 group-hover:bg-[#D4AF37]/40 transition-colors duration-500" />
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Left Scroll Button */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#0B281F] hover:bg-[#D4AF37] hover:text-white transition-all border border-gray-100 z-20 opacity-0 group-hover/arrivals:opacity-100 group-focus-within/arrivals:opacity-100 sm:opacity-100 pointer-events-auto"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}
