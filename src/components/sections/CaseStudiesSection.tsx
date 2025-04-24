
import { useRef, useEffect, useState } from "react";

const caseStudies = [
  {
    client: "E-Commerce Platform",
    metric1: "65%",
    desc1: "Reduction in order processing time",
    metric2: "42%",
    desc2: "Increase in customer satisfaction",
    description: "We implemented autonomous agents to handle inventory management and order processing, dramatically reducing operational costs and improving customer experience."
  },
  {
    client: "Financial Services Firm",
    metric1: "78%",
    desc1: "Automation of document processing",
    metric2: "$1.2M",
    desc2: "Annual cost savings",
    description: "Our custom AI solution automated document verification and data entry, allowing the company to scale operations without adding headcount."
  },
  {
    client: "Manufacturing Company",
    metric1: "30%",
    desc1: "Reduction in production errors",
    metric2: "52%",
    desc2: "Improvement in process efficiency",
    description: "We implemented predictive maintenance and quality control AI systems that significantly reduced downtime and improved product quality."
  }
];

const CaseStudiesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(true); // Start with visible state
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.findIndex(ref => ref === entry.target);
          if (index !== -1 && entry.isIntersecting) {
            setVisibleCards(prev => {
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

    cardRefs.current.forEach((card) => {
      if (card) cardObserver.observe(card);
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      
      cardRefs.current.forEach((card) => {
        if (card) cardObserver.unobserve(card);
      });
    };
  }, []);

  return (
    <section 
      id="case-studies"
      ref={sectionRef}
      className={`py-24 lg:py-32 relative ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sas-emerald font-semibold uppercase text-sm tracking-wider mb-4">Case Studies</p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
              Real Results. Real Growth.
            </h2>
            <p className="text-lg text-sas-white/80 max-w-2xl mx-auto">
              Our clients achieve measurable improvements in efficiency, cost reduction, and business growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`bg-sas-darkGray/40 border border-sas-emerald/20 rounded-lg p-6 ${visibleCards[index] ? "opacity-100" : "opacity-0"} hover:border-sas-emerald/50 transition-all duration-300`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="mb-6 text-sm font-medium text-sas-emerald/70">
                  {study.client}
                </div>
                
                <div className="flex space-x-6 mb-6">
                  <div>
                    <div className="text-3xl font-bold text-sas-emerald">{study.metric1}</div>
                    <div className="text-sm text-sas-white/70">{study.desc1}</div>
                  </div>
                  
                  <div>
                    <div className="text-3xl font-bold text-sas-emerald">{study.metric2}</div>
                    <div className="text-sm text-sas-white/70">{study.desc2}</div>
                  </div>
                </div>
                
                <p className="text-sas-white/70 text-sm">{study.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
