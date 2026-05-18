import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#achievements" },
  { name: "Education", href: "#education" },
  { name: "Contact", href: "#contact" },
];

interface NavbarProps {
  isLightMode: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ isLightMode, onToggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(2, 2, 3, 0)", "rgba(2, 2, 3, 0.7)"]
  );

  const navBorder = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.08)"]
  );

  const navPadding = useTransform(scrollY, [0, 50], ["24px", "16px"]);

  return (
    <motion.nav
      style={{
        backgroundColor: navBackground,
        borderBottomColor: navBorder,
        paddingTop: navPadding,
        paddingBottom: navPadding,
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all border-b backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.a 
          href="#" 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display text-2xl font-bold text-text-highlight tracking-tighter"
        >
          SHASHI<span className="text-brand-blue">.</span>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-surface-elevated/30 p-1.5 rounded-full border border-border-subtle">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1.5 text-xs font-medium text-text-main hover:text-text-highlight rounded-full transition-colors relative group"
            >
              {link.name}
              <motion.div 
                className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
                layoutId="nav-hover"
              />
            </motion.a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <motion.button
            onClick={onToggleTheme}
            whileHover={{ scale: 1.1, rotate: 12 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl bg-surface-elevated/50 text-text-main hover:text-text-highlight transition-all border border-border-subtle"
            aria-label="Toggle theme"
          >
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-2 bg-text-highlight text-surface-base px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-blue hover:text-white transition-all duration-300 shadow-xl shadow-brand-blue/10"
          >
            Connect
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        {/* Mobile Toggle & Theme */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full text-text-main hover:text-text-highlight"
            aria-label="Toggle theme"
          >
            {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button
            className="text-text-highlight p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-surface-base border-b border-border-subtle overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col gap-2 p-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-bold text-text-main hover:text-text-highlight py-2"
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="pt-6 mt-6 border-t border-border-subtle">
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-brand-blue text-white text-center py-4 rounded-2xl font-bold"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
