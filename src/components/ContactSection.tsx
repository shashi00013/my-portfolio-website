import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Send, Sparkles, MapPin, Calendar, Mail, Phone, Github, Linkedin } from "lucide-react";
import { useState } from "react";

const education = [
  {
    period: "2024 – 2027",
    degree: "B.Tech in Computer Science & Engineering",
    school: "Chandigarh College of Engineering, Jhanjeri",
    result: "CGPA: 8.00",
    location: "Mohali, Punjab"
  },
  {
    period: "2021 – 2024",
    degree: "Diploma in Civil Engineering",
    school: "Govt Polytechnic College, Barauni",
    result: "CGPA: 7.77",
    location: "Begusarai, Bihar"
  }
];

export function Education() {
  return (
    <section id="academic" className="py-32 bg-surface-base border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col mb-20">
          <span className="text-xs font-bold tracking-[0.4em] text-zinc-400 mb-6 block uppercase">Academic Path</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-[0.9]">
            EDUCATION
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {education.map((edu, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-12 border border-zinc-200 bg-white hover:border-black transition-all group"
            >
              <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-6 group-hover:text-black transition-colors">
                <Calendar size={14} /> {edu.period}
              </div>
              <h3 className="text-3xl font-bold text-black mb-4 leading-tight">
                {edu.degree}
              </h3>
              <p className="text-zinc-500 font-bold mb-8">{edu.school}</p>
              <div className="flex items-center justify-between pt-8 border-t border-zinc-100">
                <span className="text-sm text-zinc-400 flex items-center gap-2">
                   <MapPin size={14} /> {edu.location}
                </span>
                <span className="text-xl font-black">{edu.result}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [activeInterest, setActiveInterest] = useState("Website Design");
  const [formData, setFormData] = useState({ name: "", email: "", company: "" });

  const interests = [
    "Mobile App", "Website Design", "Branding", "Webflow development", "App design", "Graphic design", "Wordpress"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    setStatus("sending");
    try {
      const { submitInquiry } = await import("../services/messageService");
      await submitInquiry(formData.name, formData.email, formData.company, activeInterest);
      setStatus("sent");
      setFormData({ name: "", email: "", company: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section id="contact-me" className="py-32 bg-white text-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-none uppercase">
            SAY <span className="text-zinc-300">HI!</span> AND TELL ME ABOUT<br />YOUR IDEA.
          </h2>
          
          <div className="relative py-4 mb-8">
            <svg width="250" height="40" viewBox="0 0 250 40" className="inline-block">
               <path d="M0 20 L230 20 M210 5 L230 20 L210 35" stroke="black" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <p className="text-zinc-500 font-medium">Have a nice works? reach out and let's chat.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form className="space-y-16" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 flex items-center gap-1">Name <span className="text-zinc-400">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Hello..."
                  className="w-full bg-transparent border-b border-zinc-200 py-4 focus:border-zinc-950 outline-none transition-all placeholder:text-zinc-300 font-medium text-lg"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 flex items-center gap-1">Email <span className="text-zinc-400">*</span></label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="Where can i reply"
                  className="w-full bg-transparent border-b border-zinc-200 py-4 focus:border-zinc-950 outline-none transition-all placeholder:text-zinc-300 font-medium text-lg"
                />
              </div>
            </div>

            <div className="space-y-4 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-950">Company name</label>
              <input
                type="text"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
                placeholder="Your company or website?"
                className="w-full bg-transparent border-b border-zinc-200 py-4 focus:border-zinc-950 outline-none transition-all placeholder:text-zinc-300 font-medium text-lg"
              />
            </div>

            <div className="space-y-8 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-950">What's in your mind?*</label>
              <div className="flex flex-wrap gap-3">
                {interests.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveInterest(item)}
                    className={`px-6 py-3 rounded-full text-xs font-bold transition-all border ${activeInterest === item ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-6">
              <div className="relative group">
                <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className={`px-12 py-5 rounded-full font-bold text-sm tracking-tight flex items-center gap-3 shadow-xl transition-colors ${status === "error" ? "bg-red-500 text-white" : status === "sent" ? "bg-green-500 text-white" : "bg-black text-white"}`}
                   disabled={status === "sending"}
                >
                  {status === "idle" ? "Send Me" : status === "sending" ? "Sending..." : status === "error" ? "Failed!" : "Sent Successfully!"}
                  <Sparkles size={18} />
                </motion.button>
                <div className="absolute -top-4 -right-8 rotate-12">
                   <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M10 5 L30 5 L15 20 L35 20 L10 35" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                   </svg>
                </div>
              </div>
              <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">I'll must get back to you within 24 hours</p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Decorative Cross Icon */}
      <div className="absolute bottom-10 left-10 w-16 h-16 border border-zinc-100 flex items-center justify-center rotate-45 pointer-events-none">
          <div className="w-1.5 h-1.5 bg-zinc-200" />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-20 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-12 font-bold text-xs tracking-widest uppercase">
             <a href="https://dribbble.com" target="_blank" className="hover:text-zinc-400 transition-colors">Dribbble</a>
             <a href="https://linkedin.com/in/shashi0013" target="_blank" className="hover:text-zinc-400 transition-colors">Linkedin</a>
             <a href="https://instagram.com" target="_blank" className="hover:text-zinc-400 transition-colors">Instagram</a>
             <a href="https://behance.net" target="_blank" className="hover:text-zinc-400 transition-colors">Behance</a>
          </div>

          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
            Personal portfolio©2026
          </div>
        </div>
      </div>
    </footer>
  );
}
