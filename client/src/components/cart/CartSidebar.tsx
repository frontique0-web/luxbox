import { useCart } from "@/context/CartContext";
import { useSettings, formatPrice } from "@/hooks/use-settings";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "963965270528";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { currency, exchangeRate } = useSettings();

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    let message = "مرحباً، أريد طلب المنتجات التالية:\n\n";

    items.forEach((item, idx) => {
      message += `${idx + 1}. ${item.product.name}\n`;
      message += `   الكمية: ${item.quantity}\n`;
      message += `   السعر: ${formatPrice(item.product.price, currency, exchangeRate)}\n\n`;
    });

    message += `─────────────\n`;
    message += `المجموع: ${formatPrice(totalPrice.toString(), currency, exchangeRate)}\n`;
    message += `عدد المنتجات: ${totalItems}\n\n`;
    message += `شكراً لكم! 🌟`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCart}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#0B281F] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
                <h2 className="font-arabic font-bold text-xl text-white">سلة المشتريات</h2>
                <span className="bg-[#D4AF37] text-[#0B281F] text-sm font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6" data-lenis-prevent>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
                  <p className="font-arabic text-lg">السلة فارغة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 80, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 80, scale: 0.8, transition: { duration: 0.3 } }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="bg-gray-50 rounded-xl p-4 flex gap-4"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <h3 className="font-serif font-bold text-[#0B281F]">
                            {item.product.name}
                          </h3>
                          <p className="text-[#D4AF37] font-bold text-sm mb-3">
                            {formatPrice(item.product.price, currency, exchangeRate)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 p-1">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#0B281F] hover:text-white flex items-center justify-center transition-colors"
                                data-testid={`button-decrease-${item.product.id}`}
                              >
                                <Minus className="w-4 h-4" />
                              </motion.button>
                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.4, color: "#D4AF37" }}
                                animate={{ scale: 1, color: "#0B281F" }}
                                className="font-bold text-sm w-6 text-center"
                                data-testid={`text-quantity-${item.product.id}`}
                              >
                                {item.quantity}
                              </motion.span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#0B281F] hover:text-white flex items-center justify-center transition-colors"
                                data-testid={`button-increase-${item.product.id}`}
                              >
                                <Plus className="w-4 h-4" />
                              </motion.button>
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.8, rotate: -15 }}
                              whileHover={{ scale: 1.15 }}
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="font-arabic font-medium text-gray-500">
                    المجموع الفرعي
                  </span>
                  <span className="font-bold text-2xl text-[#0B281F]">
                    {formatPrice(totalPrice.toString(), currency, exchangeRate)}
                  </span>
                </div>

                {/* WhatsApp Checkout Button */}
                <Button
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-6 rounded-xl font-arabic font-bold text-lg flex items-center justify-center gap-3 shadow-lg"
                  data-testid="button-whatsapp-checkout"
                >
                  <MessageCircle className="w-6 h-6" />
                  إتمام الشراء عبر واتساب
                </Button>

                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="w-full text-gray-400 hover:text-red-500 text-sm font-arabic transition-colors"
                >
                  مسح السلة
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
