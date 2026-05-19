import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      <div style={{ transform: "translateZ(30px)" }} className="w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}

const caseStudies = [
  {
    title: "High-Performance Next.js E-Commerce Platform.",
    category: "FULL STACK",
    description: "Built a fully functional e-commerce platform using Next.js 14, integrating Stripe for payments, Tailwind CSS for styling, and Firebase for real-time order tracking and auth.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    linkText: "View on GitHub",
    url: "https://github.com/shashi00013",
    liveUrl: "https://vercel.com"
  },
  {
    title: "AI-Powered Customer Support SaaS.",
    category: "AI & WEB",
    description: "Developed an intelligent chatbot dashboard leveraging the Gemini API and React. Real-time context-aware responses reduced support tickets by 40%.",
    image: "https://images.unsplash.com/photo-1551135049-8a33b5883817?q=80&w=2070&auto=format&fit=crop",
    linkText: "View on GitHub",
    url: "https://github.com/shashi00013",
    liveUrl: "https://vercel.com"
  },
  {
    title: "Real-Time Collaborative Code Editor.",
    category: "WEB APP",
    description: "Engineered a collaborative code editor using WebSockets and React. Multiple users can edit the same file simultaneously with syntax highlighting and live preview.",
    image: "/src/assets/images/new_original_shashi_photo_1779121742145.png",
    linkText: "View on GitHub",
    url: "https://github.com/shashi00013",
    liveUrl: "https://vercel.com"
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-32 bg-surface-base" style={{ perspective: "1000px" }}>
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
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1 * i }}
                className="w-full lg:w-3/5"
              >
                <TiltCard className="w-full h-full relative cursor-crosshair">
                  <div className="relative aspect-[16/10] bg-zinc-100 rounded-[2rem] overflow-hidden group shadow-2xl">
                    <img 
                      src={study.image} 
                      alt={study.title}
                      className="absolute inset-0 w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1s] ease-out"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute top-8 left-8">
                       <div className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-xl">
                         {study.category}
                       </div>
                    </div>
                    {/* Hover Reveal Content */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 backdrop-blur-sm">
                      <span className="text-white font-bold tracking-widest uppercase border border-white/50 px-6 py-3 rounded-full backdrop-blur-md">
                        Explore Project
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: i % 2 === 1 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 + (0.1 * i) }}
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
                
                <div className="flex flex-wrap items-center gap-8">
                   <div className="flex flex-col items-start gap-1">
                      <a href={study.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-bold group cursor-pointer text-black hover:text-indigo-600 transition-colors">
                         {study.linkText}
                         <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                      </a>
                      <div className="w-full h-px bg-zinc-300 group-hover:bg-indigo-600 transition-all duration-500" />
                   </div>
                   
                   {study.liveUrl && (
                     <div className="flex flex-col items-start gap-1">
                        <a href={study.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-bold group cursor-pointer text-indigo-600 hover:text-black transition-colors">
                           Live App
                           <ArrowRight size={18} className="group-hover:scale-110 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <div className="w-full h-px bg-indigo-200 group-hover:bg-zinc-300 transition-all duration-500" />
                     </div>
                   )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Live GitHub Repositories */}
        <div className="mt-40 border-t border-zinc-200 pt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <span className="text-xs font-bold tracking-[0.4em] text-zinc-400 mb-6 block uppercase">Open Source</span>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-black leading-none">
                LATEST REPOSITORIES
              </h3>
            </div>
            <a href="https://github.com/shashi00013" target="_blank" rel="noreferrer" className="flex items-center gap-2 font-bold text-sm text-indigo-600 hover:text-black transition-colors group">
              View All on GitHub
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <GitHubRepos />
        </div>
      </div>
    </section>
  );
}

function GitHubRepos() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/users/shashi00013/repos?sort=updated&per_page=3")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRepos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse flex gap-6"><div className="h-48 bg-zinc-100 rounded-[2rem] w-full"/><div className="h-48 bg-zinc-100 rounded-[2rem] w-full hidden md:block"/><div className="h-48 bg-zinc-100 rounded-[2rem] w-full hidden lg:block"/></div>;
  }

  if (repos.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map((repo, idx) => (
        <motion.a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="p-8 border border-zinc-200 rounded-[2rem] hover:border-black hover:bg-black hover:text-white transition-all group flex flex-col h-full"
        >
          <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12"/></svg>
            {repo.name}
          </h4>
          <p className="text-sm text-zinc-500 group-hover:text-zinc-400 mb-6 flex-grow">
            {repo.description || "No description available."}
          </p>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-300">
            <span className="flex items-center gap-1">⭐ {repo.stargazers_count}</span>
            <span className="flex items-center gap-1">🍴 {repo.forks_count}</span>
            <span>{repo.language}</span>
          </div>
        </motion.a>
      ))}
    </div>
  );
}

