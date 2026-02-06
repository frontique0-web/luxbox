import { motion } from "framer-motion";
import { CheckCircle2, Award, Sparkles, Gift, Shield } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#FCFCFC] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full border-[1px] border-[#D4AF37]/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full border-[1px] border-[#0B281F]/5 translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* VISUAL SIDE (Left) */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* The Main Image in a Soft Arch */}
            <div className="relative z-10 rounded-t-[200px] rounded-b-[20px] overflow-hidden shadow-[0_20px_50px_rgba(11,40,31,0.15)] h-[500px] w-full max-w-md mx-auto lg:mx-0">
               <img 
                  src="/assets/store-interior.jpg" 
                  alt="Lux Box Store" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s]"
               />
               
               {/* Subtle Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#0B281F]/60 to-transparent opacity-60" />
               
               {/* Floating Badge */}
               <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border-l-4 border-[#D4AF37]">
                  <p className="font-serif text-[#0B281F] text-2xl font-bold">LUX BOX</p>
                  <p className="font-arabic text-xs text-gray-500">تجربة تسوق فاخرة</p>
               </div>
            </div>

            {/* Decorative Gold Frame Offset */}
            <div className="absolute top-8 left-8 z-0 rounded-t-[200px] rounded-b-[20px] border-2 border-[#D4AF37]/30 w-full h-full max-w-md hidden lg:block" />
            
            {/* Abstract Slats Graphic */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 flex gap-2 z-0 opacity-20">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-full w-2 bg-[#0B281F] rounded-full" />
                ))}
            </div>
          </motion.div>


          {/* CONTENT SIDE (Right) */}
          <motion.div 
            className="text-right"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
             <h4 className="font-sans text-[#D4AF37] font-bold tracking-[0.2em] text-sm uppercase mb-4 flex items-center justify-end gap-3">
                <span className="h-[1px] w-12 bg-[#D4AF37]" />
                About Us
             </h4>
             
             <h2 className="font-arabic text-4xl md:text-5xl text-[#0B281F] mb-8 leading-tight font-bold">
               من نحن
             </h2>

             <p className="font-arabic text-gray-600 text-lg leading-[2] mb-6 max-w-xl ml-auto">
               نحن متجر متخصص بتقديم أحدث منتجات الفيب والإكسسوارات، مع تشكيلة مختارة بعناية من <span className="text-[#0B281F] font-semibold">الساعات</span>، <span className="text-[#0B281F] font-semibold">العطور</span>، <span className="text-[#0B281F] font-semibold">الإكسسوارات</span>، <span className="text-[#0B281F] font-semibold">المكياج</span>، ومنتجات <span className="text-[#0B281F] font-semibold">العناية بالبشرة</span>، بالإضافة إلى <span className="text-[#0B281F] font-semibold">بوكسات الهدايا الفخمة</span>.
             </p>

             <p className="font-arabic text-gray-600 text-lg leading-[2] mb-10 max-w-xl ml-auto">
               نحرص على تقديم <span className="text-[#D4AF37] font-bold">منتجات أصلية</span> بجودة عالية، وأسعار منافسة، مع خدمة راقية وتجربة تسوق مميزة تناسب جميع الأذواق.
             </p>

             {/* Feature Points */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10 font-arabic">
                <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#D4AF37]/30 transition-colors">
                   <div className="text-right">
                      <h4 className="font-bold text-[#0B281F] text-base">منتجات أصلية</h4>
                      <p className="text-xs text-gray-500">جودة مضمونة 100%</p>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <Shield size={22} />
                   </div>
                </div>

                <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#D4AF37]/30 transition-colors">
                   <div className="text-right">
                      <h4 className="font-bold text-[#0B281F] text-base">أسعار منافسة</h4>
                      <p className="text-xs text-gray-500">أفضل قيمة مقابل السعر</p>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <Award size={22} />
                   </div>
                </div>

                <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#D4AF37]/30 transition-colors">
                   <div className="text-right">
                      <h4 className="font-bold text-[#0B281F] text-base">خدمة راقية</h4>
                      <p className="text-xs text-gray-500">تجربة تسوق مميزة</p>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <Sparkles size={22} />
                   </div>
                </div>

                <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#D4AF37]/30 transition-colors">
                   <div className="text-right">
                      <h4 className="font-bold text-[#0B281F] text-base">بوكسات هدايا</h4>
                      <p className="text-xs text-gray-500">تغليف فاخر ومميز</p>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <Gift size={22} />
                   </div>
                </div>
             </div>

             {/* CTA */}
             <button className="group relative px-8 py-4 bg-[#0B281F] text-white font-arabic rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2">
                   تسوق الآن
                </span>
                <div className="absolute inset-0 bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
             </button>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
