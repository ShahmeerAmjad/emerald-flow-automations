
import { useRef, useEffect, useState } from "react";
import { DollarSign, ArrowUp, X, ArrowUpRight } from "lucide-react";

const valueProps = [
  {
    title: "Cut Operational Costs by 30%",
    icon: <DollarSign className="w-8 h-8 text-sas-emerald" />
  },
  {
    title: "Increase Revenue Without Increasing Headcount",
    icon: <ArrowUp className="w-8 h-8 text-sas-emerald" />
  },
  {
    title: "Eliminate Bottlenecks Through Intelligent Automation",
    icon: <X className="w-8 h-8 text-sas-emerald" />
  },
  {
    title: "Scale Operations Without Proportional Cost Increase",
    icon: <ArrowUpRight className="w-8 h-8 text-sas-emerald" />
  }
];

const ValueSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
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
      id="values"
      ref={sectionRef}
      className={`py-24 lg:py-32 relative bg-sas-darkGray/30 ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sas-emerald font-semibold uppercase text-sm tracking-wider mb-4">Value Proposition</p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6 text-sas-white">
              Measurable Results
            </h2>
            <p className="text-lg text-sas-white/80 max-w-2xl mx-auto">
              Our automation solutions deliver tangible business outcomes that drive growth and efficiency.
            </p>
          </div>
        </div>
        
        <div 
          ref={cardContainerRef} 
          className="relative"
        >
          <div className="flex overflow-x-auto pb-8 scrollbar-none snap-x snap-mandatory">
            <div className="flex space-x-6">
              {valueProps.map((prop, index) => (
                <div 
                  key={index} 
                  className="value-card min-w-[300px] sm:min-w-[340px] h-[220px] flex flex-col justify-between snap-start"
                >
                  <div className="mb-6">{prop.icon}</div>
                  <h3 className="text-xl font-semibold text-sas-white">{prop.title}</h3>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute left-0 right-0 bottom-0 h-1 bg-sas-darkGray/50">
            <div className="h-full bg-sas-emerald w-1/4 transition-all duration-300"></div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <a href="#contact" className="btn-secondary">
            See How We Can Help Your Business
          </a>
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
