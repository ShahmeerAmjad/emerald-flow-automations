
import { useEffect, useState } from "react";
import SLogo from "../SLogo";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Background Animation */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sas-emerald/5 rounded-full blur-[100px] animate-pulse-subtle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sas-emerald/5 rounded-full blur-[100px] animate-pulse-subtle" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="container mx-auto px-6 pt-28 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <SLogo className="w-32 h-32" />
          </div>

          <h1 
            className={`text-4xl md:text-6xl lg:text-7xl font-serif font-semibold mb-6 transition-all duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="text-sas-emerald">AI Automation</span> <br className="md:hidden" />
            That Delivers Growth
          </h1>
          
          <p 
            className={`text-lg md:text-xl text-sas-white/80 max-w-2xl mx-auto mb-12 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100" : "opacity-0 translate-y-4"
            }`}
          >
            Redesigning your operating model for maximum efficiency and exponential growth
          </p>
          
          <div 
            className={`flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100" : "opacity-0 translate-y-4"
            }`}
          >
            <a href="#contact" className="btn-primary w-full md:w-auto">
              Transform Your Business
            </a>
            <a href="#services" className="link-emerald">
              See Our Solutions
            </a>
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-xs text-sas-white/50 mb-2">Scroll to explore</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-sas-emerald/0 to-sas-emerald/50 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sas-emerald rounded-full animate-ping"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
