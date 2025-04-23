
import { useEffect, useRef } from "react";

const ProblemSection = () => {
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
      ref={sectionRef}
      className="py-24 lg:py-32 relative opacity-0"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sas-emerald font-semibold uppercase text-sm tracking-wider mb-4">The Problem</p>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-center mb-6">
            <span className="text-sas-emerald">Your business doesn't need</span> <br className="hidden md:block" />
            <span className="text-sas-white">more people.</span> <br className="hidden md:block" />
            <span className="text-sas-white">It needs better systems.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-sas-white/80 text-center mt-8">
            In today's digital landscape, operational inefficiency is the silent killer of growth potential.
          </p>

          <div className="mt-16 bg-sas-darkGray/20 border border-sas-emerald/20 p-8 rounded-lg">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-4">
                <h3 className="text-xl font-semibold text-sas-emerald mb-4">Current Systems</h3>
                <ul className="space-y-3 text-sas-white/80">
                  <li className="flex items-start">
                    <span className="text-sas-emerald/60 mr-2">✗</span>
                    <span>Manual, repetitive tasks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sas-emerald/60 mr-2">✗</span>
                    <span>Bottlenecks and delays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sas-emerald/60 mr-2">✗</span>
                    <span>High operational costs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sas-emerald/60 mr-2">✗</span>
                    <span>Growth limited by headcount</span>
                  </li>
                </ul>
              </div>
              
              <div className="hidden md:block w-px bg-sas-emerald/30 mx-4"></div>
              <div className="md:hidden h-px w-full bg-sas-emerald/30 my-6"></div>
              
              <div className="flex-1 p-4">
                <h3 className="text-xl font-semibold text-sas-emerald mb-4">Intelligent Systems</h3>
                <ul className="space-y-3 text-sas-white/80">
                  <li className="flex items-start">
                    <span className="text-sas-emerald mr-2">✓</span>
                    <span>Automated workflows</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sas-emerald mr-2">✓</span>
                    <span>Optimized processes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sas-emerald mr-2">✓</span>
                    <span>Reduced operational expenses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sas-emerald mr-2">✓</span>
                    <span>Scalable growth without proportional costs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
