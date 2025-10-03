import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Palette, Rocket, Zap } from "lucide-react";

const skills = [
  {
    icon: Code2,
    title: "Development",
    description: "Building scalable applications with modern frameworks and best practices",
    color: "from-primary to-secondary",
  },
  {
    icon: Palette,
    title: "Design",
    description: "Crafting beautiful, intuitive interfaces with attention to detail",
    color: "from-secondary to-accent",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "Pushing boundaries with cutting-edge technology and creative solutions",
    color: "from-accent to-primary",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Optimizing for speed, efficiency, and exceptional user experiences",
    color: "from-primary to-accent",
  },
  // Additional boxes (keeps theme/styles intact)
  {
    icon: Code2,
    title: "Cloud & DevOps",
    description: "Deploying and scaling apps with CI/CD, containers, and cloud services",
    color: "from-secondary to-primary",
  },
  {
    icon: Rocket,
    title: "Product Mindset",
    description: "Delivering user value with iterative roadmaps and measurable outcomes",
    color: "from-accent to-secondary",
  },
  {
    icon: Palette,
    title: "UX Writing",
    description: "Clear microcopy and flows that guide users without friction",
    color: "from-primary to-secondary",
  },
  {
    icon: Zap,
    title: "Testing & Quality",
    description: "Automated tests and observability to ensure reliability at scale",
    color: "from-secondary to-accent",
  },
];

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section className="py-32 px-4 relative overflow-hidden" ref={ref}>
      {/* Background decoration with parallax */}
      <motion.div 
        style={{ y }}
        className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" 
      />
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6">
            About Me
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A passionate developer and designer dedicated to creating exceptional
            digital experiences that blend creativity with functionality
          </p>
        </motion.div>

        {/* Subtle skills ribbon (always visible, not a separate section) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex items-center gap-3 min-w-max">
            {[
              "TypeScript",
              "React",
              "Next.js",
              "Node.js",
              "Tailwind CSS",
              "Framer Motion",
              "Three.js",
              "React Query",
              "Zod",
              "Vite",
            ].map((skill) => (
              <span
                key={skill}
                className="glass-card px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground smooth-transition"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl group hover:scale-105 smooth-transition relative overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 smooth-transition`} />
              
              <div className="relative z-10">
                <div className="mb-6 inline-block p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 smooth-transition">
                  <skill.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4">
                  {skill.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {skill.description}
                </p>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-2xl group-hover:bg-primary/10 smooth-transition" />
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "50+", label: "Projects Completed" },
            { value: "5+", label: "Years Experience" },
            { value: "30+", label: "Happy Clients" },
            { value: "100%", label: "Satisfaction" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
