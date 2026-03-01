import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { Product } from "@shared/schema";
import { useSettings, formatPrice } from "@/hooks/use-settings";
import { useCartToast, CartToastContainer } from "@/components/cart/CartToast";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("luxbox-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("luxbox-cart", JSON.stringify(items));
  }, [items]);

  const { toasts, showToast } = useCartToast();

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(product.name);
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // We keep the internal price calculation in base numbers (USD) and let the UI handle the multiplier
  const baseTotalPrice = items.reduce((sum, item) => {
    // Extract base number from "AED 150" or "$150" or "150 ل.س"
    const rawNumberStr = item.product.price.replace(/(?:AED|EAD|د\.إ|ل\.س|\$)\s*/ig, '').trim();
    const price = parseFloat(rawNumberStr) || 0;
    return sum + price * item.quantity;
  }, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice: baseTotalPrice,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
      <CartToastContainer toasts={toasts} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
