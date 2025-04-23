
import { useRef, useEffect } from "react";
import SLogo from "../SLogo";

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
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
      id="about"
      ref={sectionRef}
      className="py-24 lg:py-32 relative opacity-0"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex justify-center md:justify-start mb-8">
                <SLogo className="w-24 h-24" animated={false} />
              </div>
              
              <p className="text-sas-emerald font-semibold uppercase text-sm tracking-wider mb-4">Our Team</p>
              <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6 text-sas-white">
                Automation Architects With Results
              </h2>
              
              <p className="text-lg text-sas-white/80 mb-6">
                We've helped businesses across industries redesign their operating models for maximum efficiency and growth.
              </p>
              
              <p className="text-lg text-sas-white/80 mb-8">
                Our team brings together expertise in AI engineering, business process optimization, and strategic implementation to deliver transformative results.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-sas-emerald"></div>
                  <p className="text-sas-white/80">10+ years of experience in building AI SaaS solutions</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-sas-emerald"></div>
                  <p className="text-sas-white/80">Collaborative consulting approach focused on ROI</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-sas-emerald"></div>
                  <p className="text-sas-white/80">Technical expertise combined with business acumen</p>
                </div>
              </div>
            </div>
            
            <div className="bg-sas-darkGray/30 border border-sas-emerald/20 rounded-lg p-8">
              <h3 className="text-2xl font-serif font-semibold mb-6 text-sas-white">Our Approach</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-sas-emerald mb-2">Quality Over Quantity</h4>
                  <p className="text-sas-white/70">
                    We focus on delivering high-impact solutions rather than diluting our expertise across too many services.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sas-emerald mb-2">Results-First Methodology</h4>
                  <p className="text-sas-white/70">
                    Every solution we implement is measured against clear business outcomes and ROI metrics.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sas-emerald mb-2">Business Economics Focus</h4>
                  <p className="text-sas-white/70">
                    We prioritize transformations that fundamentally improve your cost structure and growth potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
