import { motion } from "motion/react";
import { ArrowRight, ExternalLink } from "lucide-react";

const caseStudies = [
  {
    title: "High-Performance Next.js E-Commerce Platform.",
    category: "FULL STACK",
    description: "Built a fully functional e-commerce platform using Next.js 14, integrating Stripe for payments, Tailwind CSS for styling, and Firebase for real-time order tracking and auth.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    linkText: "View on GitHub",
    url: "https://github.com/shashi00013"
  },
  {
    title: "AI-Powered Customer Support SaaS.",
    category: "AI & WEB",
    description: "Developed an intelligent chatbot dashboard leveraging the Gemini API and React. Real-time context-aware responses reduced support tickets by 40%.",
    image: "https://images.unsplash.com/photo-1551135049-8a33b5883817?q=80&w=2070&auto=format&fit=crop",
    linkText: "View on GitHub",
    url: "https://github.com/shashi00013"
  },
  {
    title: "Real-Time Collaborative Code Editor.",
    category: "WEB APP",
    description: "Engineered a collaborative code editor using WebSockets and React. Multiple users can edit the same file simultaneously with syntax highlighting and live preview.",
    image: "/src/assets/images/new_original_shashi_photo_1779121742145.png",
    linkText: "View on GitHub",
    url: "https://github.com/shashi00013"
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-32 bg-surface-base">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-24">
          <div className="w-10 h-10 rotate-45 border border-zinc-200 flex items-center justify-center mb-6">
             <div className="w-2 h-2 bg-zinc-950 rotate-45" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-black mb-12 leading-none uppercase">
            CASE STUDY
          </h2>
          <p className="text-zinc-500 max-w-lg mb-20">
            I've collaborated on and built various impactful projects from scalable full-stack applications to intuitive interfaces. Here are some case studies detailing the architecture and design logic behind my work.
          </p>
        </div>

        <div className="space-y-40">
          {caseStudies.map((study, i) => (
            <div key={i} className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-32 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div 
                initial={{ opacity: 0, x: i % 2 === 1 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-3/5"
              >
                <div className="relative aspect-[16/10] bg-zinc-100 rounded-[2rem] overflow-hidden group">
                  <img 
                    src={study.image} 
                    alt={study.title}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-8 left-8">
                     <div className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-xl">
                       {study.category}
                     </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: i % 2 === 1 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-2/5"
              >
                <span className="text-[10px] bg-black text-white px-4 py-2 rounded-full font-bold tracking-widest uppercase mb-8 inline-block lg:hidden">
                  {study.category}
                </span>
                <h3 className="text-4xl md:text-5xl font-bold text-black mb-8 leading-tight tracking-tight">
                  {study.title}
                </h3>
                <p className="text-zinc-500 text-lg mb-10 leading-relaxed font-medium">
                  {study.description}
                </p>
                
                <div className="flex flex-col items-start gap-1">
                   <a href={study.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-bold group cursor-pointer text-black hover:text-indigo-600 transition-colors">
                      {study.linkText}
                      <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                   </a>
                   <div className="w-24 h-px bg-zinc-300 group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

