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
    <section className="py-24 relative overflow-hidden">
      {/* Green Marble Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B281F] via-[#0F352A] to-[#0B281F]" />
      
      {/* Marble Texture Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,255,255,0.15)_0%,transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(255,255,255,0.1)_0%,transparent_40%),radial-gradient(ellipse_at_50%_50%,rgba(212,175,55,0.05)_0%,transparent_60%)]" />
      
      {/* Marble Veins Effect */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q25 30 50 50 T100 50' fill='none' stroke='white' stroke-width='0.5'/%3E%3Cpath d='M0 70 Q35 50 70 70 T100 70' fill='none' stroke='white' stroke-width='0.3'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }} />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-64 h-64 rounded-full bg-white/3 blur-3xl pointer-events-none" />
      
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
          <h2 className="font-arabic font-bold text-4xl md:text-5xl text-white mb-4">مميزاتنا</h2>
          <p className="font-arabic text-white/60 text-lg max-w-xl mx-auto">
            نقدم لكم تجربة تسوق فريدة في قلب حلب
          </p>
        </motion.div>

        {/* Features - Horizontal Layout */}
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
                <div className="w-24 h-28 mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-t-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:bg-white/15 transition-all duration-300 relative overflow-hidden">
                  <feature.icon strokeWidth={1.5} className="w-10 h-10 text-[#D4AF37] relative z-10" />
                </div>
                {/* Gold Base */}
                <div className="w-28 h-2 mx-auto bg-gradient-to-r from-[#B4941F] via-[#D4AF37] to-[#B4941F] rounded-b-sm shadow-md" />
              </div>
              
              {/* Content */}
              <h3 className="font-arabic font-bold text-xl text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                {feature.title}
              </h3>
              <p className="font-arabic text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
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
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full shadow-lg">
            <MapPin className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-arabic text-lg">حلب - سوريا</span>
            <span className="h-4 w-[1px] bg-white/30" />
            <span className="font-serif text-sm text-[#D4AF37] tracking-wider">LUX BOX</span>
          </div>
        </motion.div>

      </div>
      
      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
    </section>
  );
}
