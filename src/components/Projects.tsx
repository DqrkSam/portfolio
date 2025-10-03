import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "AI Platform",
    description: "Next-gen machine learning platform with real-time analytics",
    tags: ["React", "Python", "TensorFlow"],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "E-Commerce Hub",
    description: "Modern shopping experience with AR product visualization",
    tags: ["Next.js", "Three.js", "Stripe"],
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Social Network",
    description: "Decentralized social platform with blockchain integration",
    tags: ["React", "Web3", "GraphQL"],
    gradient: "from-green-500 to-teal-500",
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time data visualization with advanced metrics",
    tags: ["TypeScript", "D3.js", "Node.js"],
    gradient: "from-orange-500 to-red-500",
  },
];

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section className="py-32 px-4 relative" ref={ref}>
      {/* Background decoration with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          style={{ y }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" 
        />
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [-20, 20]) }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" 
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A showcase of my latest work, combining innovation, design, and
            cutting-edge technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="glass-card rounded-2xl overflow-hidden group relative"
              style={{
                transform:
                  hoveredIndex === index
                    ? "perspective(1000px) rotateX(5deg) rotateY(5deg) scale(1.02)"
                    : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Project image placeholder with gradient */}
              <div
                className={`h-64 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 smooth-transition" />
                
                {/* Overlay icons */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 smooth-transition">
                  <button className="p-4 rounded-full bg-background/90 hover:bg-background smooth-transition">
                    <ExternalLink className="w-6 h-6 text-primary" />
                  </button>
                  <button className="p-4 rounded-full bg-background/90 hover:bg-background smooth-transition">
                    <Github className="w-6 h-6 text-primary" />
                  </button>
                </div>

                {/* Animated particles */}
                {hoveredIndex === index && (
                  <div className="absolute inset-0">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{
                          x: Math.random() * 100 + "%",
                          y: "100%",
                          opacity: 0,
                        }}
                        animate={{
                          y: "-100%",
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Project info */}
              <div className="p-8">
                <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-primary smooth-transition">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 smooth-transition pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
