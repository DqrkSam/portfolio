import { motion, useScroll, useTransform } from "framer-motion";

export const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">{/* pt-16 for navbar space */}
      {/* Content with parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.p
            className="text-accent text-lg mb-4 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            WELCOME TO THE FUTURE
          </motion.p>
          
          <motion.h1
            className="text-6xl md:text-8xl font-display font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            CREATIVE
            <br />
            DEVELOPER
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Crafting immersive digital experiences with cutting-edge technology
            and innovative design
          </motion.p>

          <motion.div
            className="flex gap-6 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <button className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg glow-border hover:scale-105 smooth-transition">
              View Projects
            </button>
            <button className="px-8 py-4 rounded-xl glass-card font-semibold text-lg hover:scale-105 smooth-transition">
              Contact Me
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
