import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";

interface ToastItem {
    id: number;
    productName: string;
}

let toastId = 0;

export function useCartToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((productName: string) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, productName }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 2500);
    }, []);

    return { toasts, showToast };
}

export function CartToastContainer({ toasts }: { toasts: ToastItem[] }) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 40, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        className="bg-[#0B281F] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#D4AF37]/30"
                    >
                        <div className="bg-[#D4AF37] rounded-full p-1.5">
                            <Check className="w-4 h-4 text-[#0B281F]" />
                        </div>
                        <span className="font-arabic text-sm font-medium">
                            تمت إضافة <span className="font-bold text-[#D4AF37]">{toast.productName}</span> للسلة
                        </span>
                        <ShoppingBag className="w-4 h-4 text-[#D4AF37] opacity-60" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
