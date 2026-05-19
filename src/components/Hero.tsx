import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Download, Mail, Github, Linkedin, Sparkles } from "lucide-react";
import { useRef, useState, useMemo, useEffect } from "react";
import profileImg from "../assets/images/shashi_profile.jpg";

function SequentialTypewriter() {
  const lines = useMemo(() => [
    { text: "CRAFTING", className: "" },
    { text: "DIGITAL", className: "text-brand-blue" },
    { text: "EXPERIENCES", className: "" }
  ], []);

  const [displayedTexts, setDisplayedTexts] = useState<string[]>(["", "", ""]);
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing');
  const [activeLine, setActiveLine] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timer: any;

    const tick = () => {
      if (phase === 'typing') {
        if (charIndex < lines[activeLine].text.length) {
          setDisplayedTexts(prev => {
            const next = [...prev];
            next[activeLine] = lines[activeLine].text.slice(0, charIndex + 1);
            return next;
          });
          setCharIndex(prev => prev + 1);
        } else {
          if (activeLine < lines.length - 1) {
            setActiveLine(prev => prev + 1);
            setCharIndex(0);
          } else {
            setPhase('waiting');
          }
        }
      } else if (phase === 'deleting') {
        if (charIndex > 0) {
          setDisplayedTexts(prev => {
            const next = [...prev];
            next[activeLine] = lines[activeLine].text.slice(0, charIndex - 1);
            return next;
          });
          setCharIndex(prev => prev - 1);
        } else {
          if (activeLine > 0) {
            setActiveLine(prev => prev - 1);
            setCharIndex(lines[activeLine - 1].text.length);
          } else {
            setPhase('typing');
            setActiveLine(0);
            setCharIndex(0);
          }
        }
      }
    };

    if (phase === 'waiting') {
      timer = setTimeout(() => {
        setPhase('deleting');
        setActiveLine(lines.length - 1);
        setCharIndex(lines[lines.length - 1].text.length);
      }, 3000);
    } else {
      timer = setTimeout(tick, phase === 'typing' ? 60 : 30);
    }

    return () => clearTimeout(timer);
  }, [phase, activeLine, charIndex, lines]);

  return (
    <div className="space-y-1">
      {lines.map((line, i) => (
        <span
          key={i}
          className={`block relative font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] ${line.className}`}
        >
          {displayedTexts[i]}
          {((activeLine === i && phase !== 'waiting') || (phase === 'waiting' && i === lines.length - 1)) && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-1 h-12 md:h-20 bg-black ml-2 mb-[-4px]"
            />
          )}
        </span>
      ))}
    </div>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-[90vh] flex flex-col bg-surface-base overflow-hidden pt-6">
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
                Full Stack Developer
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

