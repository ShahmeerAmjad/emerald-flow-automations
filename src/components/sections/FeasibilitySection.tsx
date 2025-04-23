
import { useRef, useEffect } from "react";

const FeasibilitySection = () => {
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
      id="feasibility"
      ref={sectionRef}
      className="py-24 lg:py-32 relative opacity-0"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-6 text-center">
              <span className="text-sas-white">If you're a business owner drowning in tasks—</span>
              <span className="text-sas-emerald">let's automate your chaos.</span>
            </h2>
            
            <p className="text-lg text-sas-white/80 max-w-3xl mx-auto text-center mt-8">
              Before investing in AI solutions, you need to know what's possible and what's profitable. Our Feasibility Assessment ensures your automation initiative delivers real ROI from day one.
            </p>
          </div>
          
          <div className="relative mt-24">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-sas-emerald/30 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="bg-sas-darkGray/40 border border-sas-emerald/20 rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-sas-emerald text-sas-black font-bold flex items-center justify-center text-xl mx-auto mb-6">1</div>
                <h3 className="text-xl font-semibold mb-3 text-sas-white">Technical Evaluation</h3>
                <p className="text-sas-white/70">We assess your current systems to identify automation opportunities and technical constraints.</p>
              </div>
              
              <div className="bg-sas-darkGray/40 border border-sas-emerald/20 rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-sas-emerald text-sas-black font-bold flex items-center justify-center text-xl mx-auto mb-6">2</div>
                <h3 className="text-xl font-semibold mb-3 text-sas-white">Operational Impact Analysis</h3>
                <p className="text-sas-white/70">We analyze how automation will transform your workflows and impact your business metrics.</p>
              </div>
              
              <div className="bg-sas-darkGray/40 border border-sas-emerald/20 rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-sas-emerald text-sas-black font-bold flex items-center justify-center text-xl mx-auto mb-6">3</div>
                <h3 className="text-xl font-semibold mb-3 text-sas-white">ROI Projection</h3>
                <p className="text-sas-white/70">We provide clear projections on cost savings, revenue potential, and implementation timeline.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-20 text-center">
            <p className="text-lg italic text-sas-white/60 mb-10">
              "Unlike others, we don't sell you AI for AI's sake. We deliver systems that transform your business economics."
            </p>
            
            <a href="#contact" className="btn-primary">
              Get Your Feasibility Assessment
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeasibilitySection;
