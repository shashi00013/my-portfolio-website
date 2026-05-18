import { motion } from "motion/react";

const services = ["WEB DESIGN", "APP DESIGN", "DEVELOPMENT", "WEB FLOW", "BRANDING", "UI/UX DESIGN", "AI INTEGRATION"];

export default function Marquee() {
  return (
    <div className="bg-black py-6 overflow-hidden border-y border-white/10">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex whitespace-nowrap"
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-16 mx-8">
            {services.map((service) => (
              <div key={service} className="flex items-center gap-16">
                <span className="text-white font-heading font-black text-xs tracking-[0.4em]">{service}</span>
                <div className="w-2 h-2 rotate-45 border border-white/50" />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
