import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    text: "Shashi completely transformed our digital presence. His ability to blend scalable Next.js architecture with stunning UI design resulted in a 40% increase in our user engagement.",
    name: "Rahul Verma",
    role: "Founder, TechFlow Startup",
    rating: 5
  },
  {
    text: "Working with Shashi on our AI integration project was seamless. He delivered clean code, maintained excellent communication, and solved complex backend challenges effortlessly.",
    name: "Priya Sharma",
    role: "Product Manager",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-32 bg-surface-base border-t border-zinc-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-xs font-bold tracking-[0.4em] text-zinc-400 mb-6 block uppercase">Client Feedback</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-[0.9]">
            TESTIMONIALS
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[2.5rem] border border-zinc-200 shadow-sm relative group hover:border-indigo-600 transition-colors"
            >
              <Quote size={40} className="text-zinc-100 absolute top-8 right-8 group-hover:text-indigo-50 transition-colors" />
              <div className="flex gap-1 mb-8 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-xl font-medium text-zinc-700 leading-relaxed mb-10">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-lg border border-zinc-200">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-black">{t.name}</h4>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
