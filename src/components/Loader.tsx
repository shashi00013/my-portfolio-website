import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] bg-zinc-950 flex flex-col items-center justify-center text-white"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="w-16 h-16 border-t-2 border-r-2 border-white rotate-45 flex items-center justify-center animate-pulse">
          <div className="w-4 h-4 bg-white" />
        </div>
        
        <div className="text-8xl md:text-9xl font-black tracking-tighter tabular-nums overflow-hidden h-[120px]">
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.8 }}
          >
            {Math.min(progress, 100)}<span className="text-4xl text-zinc-500">%</span>
          </motion.div>
        </div>
        
        <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        
        <p className="text-[10px] font-black tracking-[0.5em] uppercase text-zinc-500">
          Initializing Digital Experience
        </p>
      </div>
    </motion.div>
  );
}
