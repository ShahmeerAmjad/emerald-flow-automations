
import { useRef, useEffect, useState } from "react";

const caseStudies = [
  {
    client: "Professional Services Firm",
    metric1: "85%",
    desc1: "Reduction in client onboarding time",
    metric2: "$175K",
    desc2: "Annual labor cost savings",
    description: "We implemented an end-to-end workflow automation system that transformed their 12-step client onboarding process, eliminating manual data entry and automatically generating all required documentation. This allowed them to scale from 40 to 70 clients without adding staff."
  },
  {
    client: "E-Commerce Operations",
    metric1: "68%",
    desc1: "Decrease in order fulfillment errors",
    metric2: "3.2x",
    desc2: "Increase in processing capacity",
    description: "Our intelligent inventory and customer service automation eliminated bottlenecks across their operation. Their team now processes 220+ orders daily with the same staff that previously handled 70, while dramatically reducing customer service tickets."
  },
  {
    client: "Healthcare Provider - Speech Therapist",
    metric1: "94%",
    desc1: "Automated appointment scheduling",
    metric2: "$87K",
    desc2: "Quarterly revenue increase",
    description: "By implementing our patient engagement system with smart scheduling, automated follow-ups and intelligent billing workflows, no-show rates dropped from 18% to 4%. Staff previously handling scheduling were reassigned to revenue-generating activities."
  },
  {
    client: "HVAC & Appliance Repair Company",
    metric1: "3x",
    desc1: "Lead generation increase",
    metric2: "40 hours",
    desc2: "Weekly time savings",
    description: "We built a complete lead generation automation system using LinkedIn prospecting, Apollo email discovery, and Instantly campaign management. The system automatically identifies qualified prospects, finds verified contact information, and runs personalized outreach sequences - delivering a consistent pipeline of high-quality leads while the team focuses on servicing customers."
  }
];

const automationAreas = [
  "CRM Management - Winning Projects",
  "Client Onboarding - Launching Projects",
  "Customer Support & Sales - Maintaining Projects",
  "Accounts Receivable - Invoicing Project Revenue"
];

const CaseStudiesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false, false]);

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
      className={`py-16 md:py-24 lg:py-32 relative ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sas-emerald font-semibold uppercase text-sm tracking-wider mb-4">Case Studies</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold mb-6 px-2">
              We build systems that transform your profit margins, not just your technology stack.
            </h2>
            <div className="text-base md:text-lg text-sas-white/80 max-w-4xl mx-auto mb-8 md:mb-12 px-4">
              <p className="mb-6">We don't offer one-size-fits-all AI. We craft intelligent strategies tailored to your goals.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-left max-w-3xl mx-auto">
                {automationAreas.map((area, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm md:text-base">
                    <div className="w-1.5 h-1.5 rounded-full bg-sas-emerald mt-2 flex-shrink-0"></div>
                    <p className="leading-relaxed">{area}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {caseStudies.map((study, index) => (
              <div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`bg-sas-darkGray/40 border border-sas-emerald/20 rounded-lg p-4 sm:p-6 ${visibleCards[index] ? "opacity-100" : "opacity-0"} hover:border-sas-emerald/50 transition-all duration-300`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="mb-4 md:mb-6 text-xs sm:text-sm font-medium text-sas-emerald/70">
                  {study.client}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 mb-4 md:mb-6">
                  <div className="flex-1">
                    <div className="text-2xl md:text-3xl font-bold text-sas-emerald">{study.metric1}</div>
                    <div className="text-xs md:text-sm text-sas-white/70 leading-tight">{study.desc1}</div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-2xl md:text-3xl font-bold text-sas-emerald">{study.metric2}</div>
                    <div className="text-xs md:text-sm text-sas-white/70 leading-tight">{study.desc2}</div>
                  </div>
                </div>
                
                <p className="text-sas-white/70 text-xs sm:text-sm leading-relaxed">{study.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
