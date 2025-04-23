
import { useRef, useEffect, useState } from "react";

const CtaSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="contact"
      ref={sectionRef}
      className={`py-24 lg:py-32 relative bg-gradient-to-b from-transparent to-sas-darkGray/50 ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-semibold mb-6">
            Ready to Automate Your Growth?
          </h2>
          
          <p className="text-xl text-sas-white/80 mb-12">
            Let's redesign your operating model together
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
            <a href="#" className="btn-primary">
              Start Your Transformation
            </a>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <a href="mailto:contact@sassolutions.ai" className="link-emerald">
                Email Us
              </a>
              <span className="hidden md:inline text-sas-white/50">or</span>
              <a href="#" className="link-emerald">
                Schedule a Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
