import { motion } from "motion/react";
import { ArrowRight, Box, Camera, Palette, Shield, Terminal, Zap } from "lucide-react";

const services = [
  {
    title: "UI/UX CREATIVE DESIGN",
    desc: "Crafting intuitive digital paths that users actually enjoy following.",
    icon: <Palette size={32} />,
    dark: true
  },
  {
    title: "VISUAL GRAPHIC DESIGN",
    desc: "Identity systems and brand languages built for modern visibility.",
    icon: <Box size={32} />,
    dark: false
  },
  {
    title: "STRATEGY & DIGITAL MARKETING",
    desc: "Data-driven growth methods to put your product in front of the right eyes.",
    icon: <Zap size={32} />,
    dark: false
  }
];

export default function Services() {
  return (
    <section id="services" className="py-32 bg-surface-base">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div className="max-w-xl">
            <span className="text-xs font-bold tracking-[0.4em] text-zinc-400 mb-6 block uppercase">My Services</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-[0.9]">
              WHAT I'M OFFERING
            </h2>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-8">
            <p className="text-zinc-500 max-w-sm lg:text-right">
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-4 rounded-full font-bold text-xs tracking-widest uppercase"
            >
              All Service
            </motion.button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-0">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`p-12 border border-zinc-200 flex flex-col gap-12 group transition-all duration-500 ${service.dark ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-black hover:bg-zinc-50'}`}
            >
              <div className={service.dark ? 'text-white' : 'text-zinc-400 group-hover:text-black transition-colors'}>
                {service.icon}
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6 leading-tight max-w-[200px]">
                  {service.title}
                </h3>
                <p className={`text-sm mb-12 ${service.dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {service.desc}
                </p>
                <div className="flex items-center gap-4 cursor-pointer">
                  <span className="text-[10px] font-bold tracking-widest uppercase">Read More</span>
                  <ArrowRight size={16} className={`group-hover:translate-x-2 transition-transform ${service.dark ? 'text-white' : 'text-black'}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
