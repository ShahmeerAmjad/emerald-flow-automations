
import { useRef, useEffect, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Assessment of current systems and identification of automation opportunities."
  },
  {
    number: "02",
    title: "Design",
    description: "Creation of custom AI automation strategy optimized for your specific needs."
  },
  {
    number: "03",
    title: "Develop",
    description: "Implementation of AI solutions with rigorous testing and refinement."
  },
  {
    number: "04",
    title: "Deliver",
    description: "Deployment, training, and continuous optimization with ongoing support."
  }
];

const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([false, false, false, false]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = stepRefs.current.findIndex(ref => ref === entry.target);
          if (index !== -1 && entry.isIntersecting) {
            setVisibleSteps(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    stepRefs.current.forEach((step) => {
      if (step) stepObserver.observe(step);
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      
      stepRefs.current.forEach((step) => {
        if (step) stepObserver.unobserve(step);
      });
    };
  }, []);

  return (
    <section 
      id="process"
      ref={sectionRef}
      className={`py-24 lg:py-32 relative bg-sas-darkGray/30 ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sas-emerald font-semibold uppercase text-sm tracking-wider mb-4">Our Process</p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
              From Chaos to Clarity in Four Steps
            </h2>
          </div>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-0 left-1/2 h-full w-0.5 bg-sas-emerald/30 -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-16 md:space-y-32">
              {steps.map((step, index) => (
                <div
                  key={index}
                  ref={(el) => (stepRefs.current[index] = el)}
                  className={`flex flex-col md:flex-row ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center ${visibleSteps[index] ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="md:w-1/2 p-6">
                    <span className="text-4xl md:text-6xl font-serif font-bold text-sas-emerald/20">{step.number}</span>
                    <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-4 text-sas-emerald">{step.title}</h3>
                    <p className="text-sas-white/70">{step.description}</p>
                  </div>
                  
                  <div className="relative md:w-1/2 hidden md:flex justify-center">
                    <div className="w-6 h-6 rounded-full bg-sas-emerald absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                    <div className="w-12 h-12 rounded-full border border-sas-emerald/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-subtle"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
