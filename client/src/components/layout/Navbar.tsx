import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "#hero" },
    { name: "من نحن", href: "#about" },
    { name: "المنتجات", href: "#catalog" },
    { name: "مميزاتنا", href: "#features" },
    { name: "تواصل معنا", href: "#contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-4"
      )}
    >
      {/* Green Background with Slat Texture - only when scrolled */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        scrolled ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute inset-0 bg-[#0B281F]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_90%,rgba(255,255,255,0.03)_100%)] bg-[length:12px_100%] pointer-events-none" />
      </div>
      
      {/* Gold accent line at bottom - only when scrolled */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#B4941F] via-[#D4AF37] to-[#B4941F] transition-opacity duration-500",
        scrolled ? "opacity-100" : "opacity-0"
      )} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between relative">
          
          {/* Logo - Icon + Text Image (inverted to white) */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <img 
              src="/logo.png" 
              alt="Lux Box Icon" 
              className="h-10 w-10 object-contain group-hover:scale-105 transition-transform duration-300 brightness-0 invert"
            />
            <img 
              src="/logo-text.png" 
              alt="Lux Box" 
              className="h-6 object-contain brightness-0 invert"
            />
          </Link>

          {/* Desktop Navigation - Absolute Center */}
          <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-5 py-2 font-arabic text-sm font-medium text-white/80 hover:text-[#D4AF37] transition-all duration-300 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-3/4" />
              </a>
            ))}
          </div>

          {/* Right Side - Cart */}
          <div className="flex items-center gap-4">
            {/* Shopping Cart */}
            <button 
              onClick={openCart}
              className="relative p-2 text-white hover:text-[#D4AF37] transition-colors group"
              data-testid="button-cart"
            >
              <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-[#0B281F] text-xs font-bold rounded-full flex items-center justify-center" data-testid="text-cart-count">
                {totalItems}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-[#0B281F] border-t border-[#D4AF37]/30 overflow-hidden"
          >
            {/* Slat texture for mobile menu */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_90%,rgba(255,255,255,0.03)_100%)] bg-[length:12px_100%] pointer-events-none" />
            
            <div className="container mx-auto px-6 py-6 space-y-1 relative z-10">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-3 font-arabic text-lg text-white/80 hover:text-[#D4AF37] hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
