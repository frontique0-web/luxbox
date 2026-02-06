import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "perfumes", label: "Perfumes", subTabs: ["عطورات فرنسية", "عطورات إماراتية", "عطورات كوبي وان"] },
  { id: "makeup", label: "Makeup & Care", subTabs: ["مكياج", "عناية بالبشرة"] },
  { id: "watches", label: "Watches", subTabs: ["كوبي ماستر", "أوريجنال"] },
  { id: "accessories", label: "Accessories", subTabs: ["أطقم", "خواتم"] },
];

const products = [
  { id: 1, name: "Imperial Leather", price: "450 AED", type: "perfumes", badge: "Master Copy" },
  { id: 2, name: "Royal Oud", price: "380 AED", type: "perfumes", badge: "Original" },
  { id: 3, name: "Midnight Rose", price: "220 AED", type: "perfumes", badge: "Copy One" },
  { id: 4, name: "Golden Elixir", price: "550 AED", type: "perfumes", badge: "Original" },
  
  { id: 5, name: "Velvet Matte Lip", price: "120 AED", type: "makeup", badge: "Original" },
  { id: 6, name: "Glow Serum", price: "180 AED", type: "makeup", badge: "Original" },
  
  { id: 7, name: "Chrono Gold", price: "1200 AED", type: "watches", badge: "Master Copy" },
  { id: 8, name: "Silver Classic", price: "850 AED", type: "watches", badge: "Master Copy" },
];

export default function Products() {
  const [activeTab, setActiveTab] = useState("perfumes");
  const [activeSubTab, setActiveSubTab] = useState(tabs[0].subTabs[0]);

  const filteredProducts = products.filter(p => p.type === activeTab);

  return (
    <section className="py-24 bg-[#F9F9F9] min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl text-[#0B281F] mb-4">Shop by Category</h2>
          <p className="font-arabic text-[#555] text-lg">تسوق حسب الفئة</p>
        </div>

        {/* Main Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveSubTab(tab.subTabs[0]);
              }}
              className={cn(
                "px-6 py-3 font-serif text-sm uppercase tracking-wider transition-all duration-300 border border-transparent rounded-sm",
                activeTab === tab.id
                  ? "bg-[#0B281F] text-[#D4AF37] border-[#0B281F]"
                  : "bg-white text-gray-500 hover:text-[#0B281F] hover:border-[#0B281F]/20"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sub Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {tabs.find(t => t.id === activeTab)?.subTabs.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubTab(sub)}
              className={cn(
                "px-4 py-2 font-arabic text-sm rounded-full transition-all duration-300 border",
                activeSubTab === sub
                  ? "border-[#D4AF37] text-[#0B281F] bg-[#D4AF37]/10"
                  : "border-gray-200 text-gray-400 hover:border-[#D4AF37]/50"
              )}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                   <div className="bg-[#D4AF37] text-[#0B281F] text-[10px] font-bold uppercase tracking-widest py-1 px-3 shadow-md">
                     {product.badge}
                   </div>
                   {/* Golden ribbon effect visual could go here */}
                </div>

                {/* Image Container */}
                <div className="h-[300px] bg-gray-100 relative overflow-hidden flex items-center justify-center p-8">
                   <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-gray-200 to-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                   <img 
                      src="/assets/product-placeholder-1.png" 
                      alt={product.name}
                      className="w-full h-full object-contain relative z-10 mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-700" 
                   />
                </div>

                {/* Details */}
                <div className="p-6 text-center relative z-20 bg-white">
                  <h3 className="font-serif font-bold text-lg text-[#0B281F] mb-2">{product.name}</h3>
                  <p className="font-sans text-[#D4AF37] font-semibold mb-4">{product.price}</p>
                  
                  <Button 
                    className="w-full bg-[#0B281F] text-white hover:bg-[#143D30] font-arabic opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    أضف إلى السلة
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
