import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "@/components/ui/sonner";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [focused, setFocused] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast("Please fill out all fields");
      return;
    }
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailRegex.test(email)) {
      toast("Please enter a valid email address");
      return;
    }

    try {
      setSubmitting(true);
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
        {
          from_name: name,
          from_email: email,
          message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string
      );
      toast("Message sent successfully");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      toast("Failed to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-32 px-4 relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Get in <span className="neon-text">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have a project in mind? Let's create something extraordinary together
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-3xl font-display font-bold mb-8">
                Contact Information
              </h3>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "hello@portfolio.dev" },
                  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: "San Francisco, CA",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 smooth-transition">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="text-lg font-medium">{item.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social links could go here */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="glass-card p-8 rounded-2xl"
            >
              <h4 className="text-xl font-display font-bold mb-4">
                Available for freelance work
              </h4>
              <p className="text-muted-foreground">
                Open to exciting projects and collaborations. Let's build
                something amazing together!
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-8 rounded-2xl"
          >
            <form className="space-y-6" onSubmit={sendEmail}>
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:border-primary smooth-transition"
                  style={{
                    boxShadow:
                      focused === "name"
                        ? "0 0 20px hsl(var(--primary) / 0.3)"
                        : "none",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:border-primary smooth-transition"
                  style={{
                    boxShadow:
                      focused === "email"
                        ? "0 0 20px hsl(var(--primary) / 0.3)"
                        : "none",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:border-primary smooth-transition resize-none"
                  style={{
                    boxShadow:
                      focused === "message"
                        ? "0 0 20px hsl(var(--primary) / 0.3)"
                        : "none",
                  }}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                className="w-full px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg glow-border flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Message"}
                <Send className="w-5 h-5 group-hover:translate-x-1 smooth-transition" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
