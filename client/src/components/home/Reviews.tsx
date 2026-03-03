import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

const reviews = [
  {
    name: "أحمد الشامي",
    rating: 5,
    text: "أفضل متجر في حلب! المنتجات أصلية والخدمة ممتازة. اشتريت عطر فرنسي وساعة وكانت الجودة رائعة جداً.",
    product: "عطور وساعات",
    initials: "أش",
  },
  {
    name: "سارة المحمد",
    rating: 5,
    text: "تجربة تسوق راقية ومميزة. بوكس الهدايا كان فخم جداً وتغليف احترافي. أنصح الجميع بزيارة المتجر.",
    product: "بوكسات هدايا",
    initials: "سم",
  },
  {
    name: "محمد العلي",
    rating: 5,
    text: "أسعار منافسة وجودة عالية. اشتريت فيب Vozol وكان ممتاز. المتجر منظم وفخم والموظفين محترمين.",
    product: "فيب",
    initials: "مع",
  },
  {
    name: "ريم الخطيب",
    rating: 5,
    text: "المكياج الموجود عندهم أصلي 100%. جربت الفاونديشن وسيروم البشرة وكانت النتيجة مذهلة. شكراً Lux Box!",
    product: "مكياج وعناية",
    initials: "رخ",
  },
  {
    name: "عمر الحسن",
    rating: 5,
    text: "اشتريت طقم إكسسوارات ذهبي كهدية وكان أنيق جداً. التغليف فاخر والسعر مناسب مقارنة بالجودة.",
    product: "إكسسوارات",
    initials: "عح",
  },
  {
    name: "لينا الأسعد",
    rating: 5,
    text: "حقيبة Louis Style رائعة! الخامة ممتازة والشكل أنيق جداً. المتجر عنده تشكيلة واسعة ومتنوعة.",
    product: "شناتي",
    initials: "لأ",
  },
];

export default function Reviews() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#0B281F' }}>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B281F] via-[#0E2E24] to-[#0B281F]" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url(/assets/marble-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#D4AF37]/10 pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full bg-[#D4AF37]/5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6">
            <MessageCircle className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h4 className="font-sans text-[#D4AF37] font-bold tracking-[0.2em] text-sm uppercase mb-4 flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-[#D4AF37]/50" />
            Testimonials
            <span className="h-[1px] w-12 bg-[#D4AF37]/50" />
          </h4>
          <h2 className="font-arabic font-bold text-4xl md:text-5xl text-white mb-4">آراء عملائنا</h2>
          <p className="font-arabic text-white/50 text-lg max-w-xl mx-auto">
            ثقة عملائنا هي أغلى ما نملك
          </p>
        </motion.div>

        {/* Desktop: Always show all 6 */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: Show 3 or all with animation */}
        <div className="md:hidden space-y-5">
          <AnimatePresence mode="sync">
            {(showAll ? reviews : reviews.slice(0, 3)).map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Toggle Button */}
          <motion.div className="pt-4 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-arabic text-base transition-all duration-300 bg-[#D4AF37] text-[#0B281F] font-bold hover:bg-[#e0c04a] shadow-lg"
            >
              <span>{showAll ? "إخفاء البقية" : "إظهار الكل"}</span>
              {showAll ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </motion.div>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
    </section>
  );
}

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="relative bg-[#ffffff15] rounded-2xl p-6 border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 h-full flex flex-col group shadow-lg">

      {/* Top row: avatar + name + stars */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} size={14} className="fill-[#D4AF37] text-[#D4AF37]" />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <h4 className="font-arabic font-bold text-white text-sm">{review.name}</h4>
            <p className="font-arabic text-xs text-[#D4AF37]/80">{review.product}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-arabic font-bold text-xs shrink-0">
            {review.initials}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] w-full bg-white/10 mb-4" />

      {/* Review text */}
      <p className="font-arabic text-white/70 text-[15px] leading-[2] text-right flex-1">
        "{review.text}"
      </p>
    </div>
  );
}
