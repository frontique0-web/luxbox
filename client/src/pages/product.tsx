import React, { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Star } from "lucide-react";
import { useSettings, formatPrice } from "@/hooks/use-settings";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Product() {
    const [, params] = useRoute("/product/:id");
    const productId = parseInt(params?.id || "0");

    const { addToCart } = useCart();
    const { currency, exchangeRate } = useSettings();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data: product, isLoading: productLoading } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => fetchProduct(productId),
        enabled: productId > 0,
    });

    const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
        queryKey: ["suggested-products", product?.categoryId],
        queryFn: () => fetchProducts(product?.categoryId),
        enabled: !!product?.categoryId,
    });

    const handleImageClick = (img: string) => setSelectedImage(img);

    if (productLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50">
                <Navbar />
                <div className="container mx-auto px-6 py-24">
                    <Skeleton className="w-full h-[600px] rounded-3xl" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                    <h1 className="text-3xl font-arabic font-bold text-gray-800 mb-4">المنتج غير موجود</h1>
                    <p className="text-gray-500 font-arabic mb-8">عذراً، لم نتمكن من العثور على المنتج الذي تبحث عنه.</p>
                    <Link href="/">
                        <Button className="bg-[#0B281F] text-[#D4AF37] hover:bg-[#154636]">
                            العودة للرئيسية
                        </Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Determine available images
    const allImages = [product.imageUrl, product.imageUrl2, product.imageUrl3].filter(Boolean) as string[];
    const mainImage = selectedImage || product.imageUrl;
    // Filter out the current product from suggestions
    const suggestedProducts = suggestions?.filter(p => p.id !== product.id).slice(0, 4) || [];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-24 pb-16">
                {/* Breadcrumb */}
                <div className="container mx-auto px-6 mb-8">
                    <Link href="/">
                        <button className="flex items-center text-gray-500 hover:text-[#D4AF37] transition-colors font-arabic text-sm">
                            <ChevronRight className="w-4 h-4 ml-1" />
                            الرئيسية
                        </button>
                    </Link>
                </div>

                {/* Product Details Section */}
                <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
                    <div className="relative bg-[#0B281F] rounded-[40px] p-6 lg:p-12 overflow-hidden shadow-2xl">
                        {/* Pattern Background for the entire section */}
                        <div
                            className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none"
                            style={{
                                backgroundImage: `repeating-linear-gradient(45deg, #D4AF37, #D4AF37 1px, transparent 1px, transparent 16px)`
                            }}
                        />
                        {/* Subtle glow effect */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37] opacity-10 rounded-full blur-[100px] pointer-events-none" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start relative z-10">
                            {/* Image Gallery */}
                            <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full aspect-[4/5] bg-white rounded-3xl p-6 flex flex-col items-center justify-center relative shadow-lg group overflow-hidden"
                                >

                                    {product.badge && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <div className="bg-[#D4AF37]/90 backdrop-blur-sm px-3 py-1.5 rounded border border-[#D4AF37]/30 shadow-sm">
                                                <span className="text-white text-xs font-bold uppercase tracking-widest">
                                                    {product.badge}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <img
                                        src={mainImage}
                                        alt={product.name}
                                        className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                                    />
                                </motion.div>

                                {/* Thumbnails */}
                                {allImages.length > 1 && (
                                    <div className="flex gap-3 justify-center">
                                        {allImages.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleImageClick(img)}
                                                className={`w-20 h-24 flex-shrink-0 rounded-2xl border-2 overflow-hidden bg-white p-2 transition-all ${mainImage === img
                                                    ? 'border-[#D4AF37] shadow-md scale-105'
                                                    : 'border-gray-100 hover:border-[#D4AF37]/50 opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col text-right justify-center">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="flex items-center gap-2 mb-4 justify-end">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-400 font-sans">(128)</span>
                                    </div>

                                    <h1 className="text-3xl lg:text-5xl font-serif font-bold text-white mb-3 leading-tight">
                                        {product.name}
                                    </h1>
                                    <p className="text-gray-300 text-sm font-sans mb-6" dir="ltr">
                                        الرمز: {product.code}
                                    </p>

                                    <div className="mb-8">
                                        <span className="text-3xl font-sans font-bold text-[#D4AF37]">
                                            {formatPrice(product.price, currency, exchangeRate)}
                                        </span>
                                    </div>

                                    <div className="prose prose-sm lg:prose-base text-gray-300 font-arabic mb-10 leading-relaxed">
                                        <p>{product.description}</p>
                                    </div>

                                    <motion.div
                                        className="space-y-4"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={() => addToCart(product)}
                                            className="w-full h-16 text-lg font-arabic font-bold tracking-wide rounded-2xl bg-[#D4AF37] text-[#0B281F] hover:bg-white hover:text-[#0B281F] transition-all duration-300 shadow-lg"
                                        >
                                            <ShoppingBag className="w-5 h-5 ml-2" />
                                            إضافة للسلة
                                        </Button>
                                    </motion.div>

                                    {/* WhatsApp Buy Now */}
                                    <motion.a
                                        href={`https://wa.me/963965270528?text=${encodeURIComponent(`مرحباً، أريد طلب هذا المنتج:\n🛍️ ${product.name}\nالرمز: ${product.code}\nالسعر: ${formatPrice(product.price, currency, exchangeRate)}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="mt-3 flex items-center justify-center gap-3 w-full h-14 rounded-2xl font-arabic font-bold text-base text-white transition-all duration-300 shadow-md"
                                        style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                                    >
                                        {/* WhatsApp icon */}
                                        <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        اشتر الآن عبر واتساب
                                    </motion.a>


                                    <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                                        <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                                            <p className="font-arabic font-bold text-white mb-1">توصيل سريع</p>
                                            <p className="text-xs text-gray-400 font-arabic">خلال 24-48 ساعة</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                                            <p className="font-arabic font-bold text-white mb-1">منتجات أصلية</p>
                                            <p className="text-xs text-gray-400 font-arabic">مضمونة 100%</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggestions Section */}
                {suggestedProducts.length > 0 && (
                    <div className="container mx-auto px-6 mt-24 max-w-6xl">
                        <h2 className="text-2xl font-arabic font-bold text-[#0B281F] mb-8 text-right border-b pb-4">المقترحات</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {suggestedProducts.map(suggestion => (
                                <Link key={suggestion.id} href={`/product/${suggestion.id}`} className="block group">
                                    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col">
                                        <div className="aspect-[4/5] w-full bg-[#fcfcfc] relative p-4 flex items-center justify-center">
                                            <img
                                                src={suggestion.imageUrl}
                                                alt={suggestion.name}
                                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4 text-right flex-grow flex flex-col justify-between">
                                            <h3 className="font-arabic font-medium text-sm text-gray-800 mb-2 line-clamp-2">{suggestion.name}</h3>
                                            <span className="font-sans font-bold text-gray-600">{formatPrice(suggestion.price, currency, exchangeRate)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
