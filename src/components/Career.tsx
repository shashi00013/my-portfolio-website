import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const experiences = [
  {
    id: "01",
    role: "Full Stack Engineer",
    company: "Freelance",
    duration: "2 YEARS",
    location: "Remote"
  },
  {
    id: "02",
    role: "Project Lead",
    company: "Build With India",
    duration: "1 YEAR",
    location: "Bangalore"
  },
  {
    id: "03",
    role: "Core Member",
    company: "ACM Student Chapter",
    duration: "2 YEARS",
    location: "Jhanjeri"
  },
  {
    id: "04",
    role: "Frontend Developer",
    company: "TechGig Marathon",
    duration: "2 YEARS",
    location: "National"
  }
];

export function Career() {
  return (
    <section id="experience" className="py-32 bg-surface-base">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-24">
          <div className="w-10 h-10 rotate-45 border border-zinc-200 flex items-center justify-center mb-6">
             <div className="w-2 h-2 bg-zinc-950 rotate-45" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-black mb-8 leading-none">
            EXPERIENCE
          </h2>
          <p className="text-zinc-500 max-w-lg">
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.
          </p>
        </div>

        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`group border border-zinc-200 p-8 md:p-12 transition-all duration-500 hover:border-black ${i === 0 ? 'bg-zinc-950 text-white' : 'bg-white text-black'}`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-24">
                <div className={`w-12 h-12 flex items-center justify-center text-xl font-black rounded-lg ${i === 0 ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  {exp.id}
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">{exp.role}</h3>
                  <div className="flex items-center gap-4 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    <span className="font-bold">{exp.company}</span>
                    <div className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span>{exp.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 md:text-right">
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${i === 0 ? 'text-zinc-500' : 'text-zinc-400'}`}>Job Duration</span>
                    <span className="text-sm font-bold">{exp.duration}</span>
                  </div>
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform hidden md:block" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

