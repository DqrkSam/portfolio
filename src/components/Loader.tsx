import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onLoadingComplete: () => void;
}

export const Loader = ({ onLoadingComplete }: LoaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                boxShadow: "0 0 20px hsl(var(--primary))",
              }}
            />
          ))}
        </div>

        {/* Logo/Brand */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-8"
          >
            <h1 className="text-7xl font-display font-bold neon-text">
              PORTFOLIO
            </h1>
          </motion.div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              style={{
                boxShadow: "0 0 20px hsl(var(--primary))",
              }}
            />
          </div>

          <motion.p
            className="mt-4 text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {progress}%
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
