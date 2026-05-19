import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Download, Mail, Github, Linkedin, Sparkles } from "lucide-react";
import { useRef, useState, useMemo, useEffect } from "react";
import profileImg from "../assets/images/shashi_profile.jpg";

import { useMotionValue, useSpring } from "motion/react";

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: {x: number, y: number, vx: number, vy: number, size: number}[] = [];
    let animationFrameId: number;
    let mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1
        });
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-50" />;
}

const CHARS = "!<>-_\\/[]{}—=+*^?#________";
function ScrambleText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let iteration = 0;
    let interval: any = null;

    interval = setInterval(() => {
      setDisplayText(text.split("").map((letter, index) => {
        if(index < iteration) {
          return text[index];
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));

      if(iteration >= text.length){ 
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
}

function MagneticWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.2);
    y.set(middleY * 0.2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-[90vh] flex flex-col bg-surface-base overflow-hidden pt-6">
      <ParticleBackground />
      {/* Header Navigation */}
      <nav className="w-full px-6 lg:px-8 flex items-center justify-between py-4 md:py-8 z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-bold text-xl tracking-tighter"
        >
          it's <span className="text-zinc-500">me</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {['My Projects', 'About Me', 'Contact me'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-xs font-bold text-zinc-500 hover:text-black transition-colors flex items-center gap-1 group"
            >
              {item}
              <ArrowRight size={12} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300 opacity-50 group-hover:opacity-100" />
            </motion.a>
          ))}

          <motion.a
            href="/login"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-6 py-2.5 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10 ml-2"
          >
            Login
          </motion.a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 w-full flex-grow grid lg:grid-cols-12 gap-12 items-center relative py-12 lg:py-0">
        {/* Left Content */}
        <div className="lg:col-span-7 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👋</span>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Hello! I'm <span className="text-zinc-950">Shashi</span>
                </h2>
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full self-start md:self-auto mt-2 md:mt-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Open to Work</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-px bg-zinc-300" />
              <span className="text-xl md:text-2xl font-bold text-zinc-900 flex items-center gap-2">
                <ScrambleText text="Full Stack Developer" />
                <Sparkles size={20} className="text-zinc-400" />
              </span>
            </div>

            <div className="mb-12">
              <p className="text-zinc-600 text-lg md:text-xl max-w-xl leading-relaxed mb-8">
                Shashi Kumar, a Full Stack Developer & AI Engineer specializing in creating seamless digital experiences that blend high-performance code with intelligent design.
              </p>

              <ul className="space-y-4">
                {[
                  "Next.js & React Ecosystem Mastery",
                  "AI Integration via Gemini & OpenAI",
                  "Scalable Cloud Architecture (Firebase)"
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3 text-zinc-500 font-medium"
                  >
                    <div className="w-4 h-4 rounded-full border border-zinc-300 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <MagneticWrapper>
                <motion.a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-white px-10 py-5 rounded-full font-bold text-sm tracking-tight shadow-xl shadow-black/20 inline-block"
                >
                  Let's Talk
                </motion.a>
              </MagneticWrapper>

              <motion.a
                href="/resume.pdf"
                target="_blank"
                download
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  try {
                    const { logActivity } = await import("../services/activityService");
                    await logActivity("public", "Anonymous User", "Downloaded Resume");
                    
                    // Trigger Email Notification
                    fetch("https://formsubmit.co/ajax/sk5251476@gmail.com", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                      },
                      body: JSON.stringify({
                        _subject: "🚀 PORTFOLIO ALERT: Someone Downloaded Your CV!",
                        message: "A visitor on your portfolio just clicked the 'Download CV' button. Check your Analytics dashboard for more details.",
                        timestamp: new Date().toLocaleString()
                      })
                    }).catch(() => {}); // silent fail if adblocker blocks it
                  } catch (e) {}
                }}
                className="flex items-center gap-2 font-bold text-sm group cursor-pointer"
              >
                Download Cv
                <div className="relative overflow-hidden">
                  <Download size={18} className="group-hover:translate-y-6 transition-transform duration-300" />
                  <Download size={18} className="absolute -top-6 left-0 group-hover:translate-y-6 transition-transform duration-300" />
                </div>
              </motion.a>
            </div>

            {/* Social Links Bar */}
            <div className="mt-16 pt-8 border-t border-zinc-100 flex items-center gap-10 text-xs font-black uppercase tracking-[0.3em]">
              {[
                { href: "https://github.com/shashi00013", icon: <Github size={18} />, label: "Github" },
                { href: "https://linkedin.com/in/shashi0013", icon: <Linkedin size={18} />, label: "Linkedin" },
                { href: "mailto:sk5251476@gmail.com", icon: <Mail size={18} />, label: "Mail" }
              ].map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4
                  }}
                  className="flex items-center gap-3 text-zinc-400 hover:text-black transition-colors group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                  <span>{link.label}</span>
                </motion.a>
              ))}
            </div>

            {/* Spotify Now Playing / Personality Embed */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 hidden md:block w-full max-w-sm"
            >
              <iframe 
                style={{ borderRadius: '12px' }} 
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0" 
                width="100%" 
                height="80" 
                frameBorder="0" 
                allowFullScreen={false} 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Visual */}
        <div className="lg:col-span-12 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2 flex items-center justify-center lg:justify-end point-events-none">
          <motion.div
            style={{ y: yImage, opacity }}
            className="relative w-full max-w-[500px] aspect-[3/4] lg:mr-[-10%]"
          >
            <div className="absolute inset-0 bg-zinc-100 rounded-[3rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-transparent to-zinc-50" />
            </div>

            <img
              src={profileImg}
              alt="Shashi Kumar"
              className="absolute inset-0 w-full h-full object-cover rounded-[3rem] drop-shadow-2xl"
              referrerPolicy="no-referrer"
            />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[60%] left-[-15%] bg-black text-white px-8 py-4 rounded-full font-black text-xl tracking-tighter shadow-2xl"
            >
              Hello
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

