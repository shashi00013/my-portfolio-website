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
      </div>
    </section>
  );
}
