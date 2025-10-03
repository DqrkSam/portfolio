import { useState, useEffect } from "react";
import { Loader } from "@/components/Loader";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent scrolling during loading
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <Loader onLoadingComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <>
          <BackgroundAnimation />
          <Navbar />
          <div className="relative z-10">
            <div id="hero">
              <Hero />
            </div>
            <div id="about">
              <About />
            </div>
            <div id="projects">
              <Projects />
            </div>
            <div id="contact">
              <Contact />
            </div>
            
            {/* Footer */}
            <footer className="py-12 px-4 border-t border-border/50">
              <div className="max-w-7xl mx-auto text-center">
                <p className="text-muted-foreground">
                  © 2025 Portfolio. Crafted with passion and precision.
                </p>
              </div>
            </footer>
          </div>
        </>
      )}
    </>
  );
};

export default Index;
