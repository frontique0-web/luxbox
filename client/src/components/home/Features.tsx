import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Clock, Sparkles } from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "منتجات أصلية",
    desc: "نختار لكم أفضل المنتجات الأصلية والماستر كوبي بجودة عالية"
  },
  {
    icon: MapPin,
    title: "موقع مميز في حلب",
    desc: "زورونا في متجرنا لتعيشوا تجربة التسوق الفاخرة"
  },
  {
    icon: Clock,
    title: "خدمة سريعة",
    desc: "نوفر لكم خدمة سريعة ومميزة في جميع الأوقات"
  },
  {
    icon: Sparkles,
    title: "تشكيلة متنوعة",
    desc: "عطور، ساعات، إكسسوارات، مكياج، وبوكسات هدايا فاخرة"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">

      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      {/* Background soft shapes */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[500px] h-[500px] rounded-full bg-[#0B281F]/5 pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[400px] h-[400px] rounded-full bg-[#D4AF37]/5 pointer-events-none" />

      {/* Vertical slats */}
      <div className="absolute top-0 left-0 h-full flex gap-[80px] opacity-[0.02] pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="h-full w-[1px] bg-[#0B281F]" />
        ))}
      </div>

      {/* Arch pattern at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] rounded-b-full border border-[#D4AF37]/10 opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">

        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="font-sans text-[#D4AF37] font-bold tracking-[0.2em] text-sm uppercase mb-4 flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-[#D4AF37]/50" />
            Our Features
            <span className="h-[1px] w-12 bg-[#D4AF37]/50" />
          </h4>
          <h2 className="font-arabic font-bold text-4xl md:text-5xl text-[#0B281F] mb-4">مميزاتنا</h2>
          <p className="font-arabic text-gray-500 text-lg max-w-xl mx-auto">
            نقدم لكم تجربة تسوق فريدة في قلب حلب
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="group text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              {/* Icon with Arch Shape */}
              <div className="relative mx-auto mb-8">
                <div className="w-24 h-28 mx-auto bg-[#FAFAF8] border border-gray-100 rounded-t-full flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:border-[#D4AF37]/30 transition-all duration-300 relative overflow-hidden">
                  <feature.icon strokeWidth={1.5} className="w-10 h-10 text-[#D4AF37] relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {/* Gold Base */}
                <div className="w-28 h-2 mx-auto bg-gradient-to-r from-[#B4941F] via-[#D4AF37] to-[#B4941F] rounded-b-sm shadow-md" />
              </div>

              {/* Content */}
              <h3 className="font-arabic font-bold text-xl text-[#0B281F] mb-3 group-hover:text-[#D4AF37] transition-colors">
                {feature.title}
              </h3>
              <p className="font-arabic text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Location Badge */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-3 bg-[#0B281F] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow">
            <MapPin className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-arabic text-lg">حلب - سوريا</span>
            <span className="h-4 w-[1px] bg-white/30" />
            <span className="font-serif text-sm text-[#D4AF37] tracking-wider">LUX BOX</span>
          </div>
        </motion.div>

      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
    </section>
  );
}
