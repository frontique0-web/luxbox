import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronDown, ChevronUp } from "lucide-react";

const reviews = [
  {
    name: "أحمد الشامي",
    rating: 5,
    text: "أفضل متجر في حلب! المنتجات أصلية والخدمة ممتازة. اشتريت عطر فرنسي وساعة وكانت الجودة رائعة جداً.",
    product: "عطور وساعات",
  },
  {
    name: "سارة المحمد",
    rating: 5,
    text: "تجربة تسوق راقية ومميزة. بوكس الهدايا كان فخم جداً وتغليف احترافي. أنصح الجميع بزيارة المتجر.",
    product: "بوكسات هدايا",
  },
  {
    name: "محمد العلي",
    rating: 5,
    text: "أسعار منافسة وجودة عالية. اشتريت فيب Vozol وكان ممتاز. المتجر منظم وفخم والموظفين محترمين.",
    product: "فيب",
  },
  {
    name: "ريم الخطيب",
    rating: 5,
    text: "المكياج الموجود عندهم أصلي 100%. جربت الفاونديشن وسيروم البشرة وكانت النتيجة مذهلة. شكراً Lux Box!",
    product: "مكياج وعناية",
  },
  {
    name: "عمر الحسن",
    rating: 5,
    text: "اشتريت طقم إكسسوارات ذهبي كهدية وكان أنيق جداً. التغليف فاخر والسعر مناسب مقارنة بالجودة.",
    product: "إكسسوارات",
  },
  {
    name: "لينا الأسعد",
    rating: 5,
    text: "حقيبة Louis Style رائعة! الخامة ممتازة والشكل أنيق جداً. المتجر عنده تشكيلة واسعة ومتنوعة.",
    product: "شناتي",
  },
];

export default function Reviews() {
  const [showAll, setShowAll] = useState(false);

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="py-24 bg-white relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-[#D4AF37]/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[350px] h-[350px] rounded-full bg-[#0B281F]/[0.02] blur-3xl pointer-events-none" />

      {/* Vertical slats */}
      <div className="absolute top-0 left-0 h-full flex gap-[80px] opacity-[0.015] pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="h-full w-[1px] bg-[#0B281F]" />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="font-sans text-[#D4AF37] font-bold tracking-[0.2em] text-sm uppercase mb-4 flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-[#D4AF37]/50" />
            Testimonials
            <span className="h-[1px] w-12 bg-[#D4AF37]/50" />
          </h4>
          <h2 className="font-arabic font-bold text-4xl md:text-5xl text-[#0B281F] mb-4">آراء عملائنا</h2>
          <p className="font-arabic text-gray-500 text-lg max-w-xl mx-auto">
            ثقة عملائنا هي أغلى ما نملك
          </p>
        </motion.div>

        {/* Reviews Grid - Desktop: 3 cols, Mobile: 1 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Desktop: Always show all 6 */}
          {reviews.map((review, idx) => (
            <motion.div
              key={`desktop-${idx}`}
              className={`hidden md:block`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}

          {/* Mobile: Show 3 or all with animation */}
          <AnimatePresence mode="sync">
            {visibleReviews.map((review, idx) => (
              <motion.div
                key={`mobile-${idx}`}
                className="block md:hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mobile Toggle Button */}
        <motion.div 
          className="mt-10 flex justify-center md:hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="group inline-flex items-center gap-2 px-8 py-3 bg-[#0B281F] text-white font-arabic rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-base"
          >
            <span>{showAll ? "إخفاء البقية" : "إظهار الكل"}</span>
            {showAll ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </motion.div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
    </section>
  );
}

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="bg-[#FAFAF8] rounded-2xl p-6 border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col relative group">
      
      {/* Quote icon */}
      <div className="absolute top-5 left-5 text-[#D4AF37]/10 group-hover:text-[#D4AF37]/20 transition-colors">
        <Quote size={40} />
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-4 justify-end">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} size={16} className="fill-[#D4AF37] text-[#D4AF37]" />
        ))}
      </div>

      {/* Review text */}
      <p className="font-arabic text-gray-600 text-[15px] leading-[1.9] text-right flex-1 mb-5">
        "{review.text}"
      </p>

      {/* Divider */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent mb-4" />

      {/* Reviewer info */}
      <div className="flex items-center justify-end gap-3">
        <div className="text-right">
          <h4 className="font-arabic font-bold text-[#0B281F] text-sm">{review.name}</h4>
          <p className="font-arabic text-xs text-[#D4AF37]">{review.product}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B281F] to-[#0B281F]/80 flex items-center justify-center text-[#D4AF37] font-arabic font-bold text-sm shrink-0">
          {review.name.charAt(0)}
        </div>
      </div>
    </div>
  );
}
