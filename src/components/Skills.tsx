import { motion } from "motion/react";
import { Code2, Database, LayoutTemplate, Cpu, Sparkles, Box, Layout, Cloud } from "lucide-react";

const skills = [
  { name: "React & Next.js", icon: <Layout size={24} /> },
  { name: "TypeScript", icon: <Code2 size={24} /> },
  { name: "Firebase & GCP", icon: <Cloud size={24} /> },
  { name: "Tailwind CSS", icon: <LayoutTemplate size={24} /> },
  { name: "Node.js & Express", icon: <Box size={24} /> },
  { name: "MongoDB", icon: <Database size={24} /> },
  { name: "AI/LLM Integration", icon: <Sparkles size={24} /> },
  { name: "System Architecture", icon: <Cpu size={24} /> },
];

export function Skills() {
  return (
    <section id="skills" className="py-32 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-24">
          <span className="text-xs font-bold tracking-[0.4em] text-zinc-400 mb-6 block uppercase">Technical Arsenal</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-[0.9]">
            MY SKILLS
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 border border-zinc-200 bg-zinc-50 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-black hover:bg-black hover:text-white transition-all group"
            >
              <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                {skill.icon}
              </div>
              <h3 className="font-bold text-sm md:text-base text-center">{skill.name}</h3>
            </motion.div>
          ))}
        </div>

        {/* GitHub Contributions & Certifications */}
        <div className="mt-24 grid lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 p-8 md:p-12 border border-zinc-200 bg-zinc-50 rounded-[2.5rem] overflow-hidden"
          >
            <h3 className="font-bold text-xl md:text-2xl mb-8 flex items-center gap-3">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub Contributions
            </h3>
            <div className="w-full overflow-x-auto no-scrollbar">
              <img 
                src="https://ghchart.rshah.org/black/shashi00013" 
                alt="Shashi Kumar's GitHub Activity Graph" 
                className="w-full min-w-[600px] mix-blend-multiply opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 p-8 md:p-12 border border-zinc-200 bg-white rounded-[2.5rem]"
          >
            <h3 className="font-bold text-xl md:text-2xl mb-8">Certifications</h3>
            <ul className="space-y-6">
              {[
                { name: "Google Cloud Engineering", org: "Google / Coursera" },
                { name: "Full Stack Development", org: "Meta" },
                { name: "Generative AI Fundamentals", org: "DeepLearning.AI" }
              ].map((cert, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[10px] font-black text-black">{i+1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-black">{cert.name}</h4>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">{cert.org}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
