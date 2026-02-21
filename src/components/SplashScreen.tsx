import { motion, AnimatePresence } from "motion/react";
import TiensLogo from "./TiensLogo";
import { useEffect, useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for exit animation to finish
    }, 2800); // Show splash for 2.8 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.1,
            filter: "blur(10px)",
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[200] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background decorative elements */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] max-w-[1000px] max-h-[1000px] bg-tiens-primary/5 dark:bg-tiens-primary-light/5 rounded-full blur-3xl"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-32 h-32 mb-8 relative">
              <motion.div
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 1.2, type: "spring", bounce: 0.5, delay: 0.1 }}
                className="absolute inset-0"
              >
                <TiensLogo className="w-full h-full drop-shadow-2xl" showText={false} />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden flex flex-col items-center"
            >
              <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                TIENS
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            >
              <p className="text-sm font-bold text-tiens-primary dark:text-tiens-primary-light tracking-[0.3em] uppercase">
                Sudan Branch
              </p>
            </motion.div>
          </motion.div>

          {/* Loading line */}
          <motion.div 
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-1 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-tiens-primary to-tiens-primary-light rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 1.8, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
