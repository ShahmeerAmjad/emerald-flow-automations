
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/sections/HeroSection";
import ProblemSection from "../components/sections/ProblemSection";
import ServicesSection from "../components/sections/ServicesSection";
import ValueSection from "../components/sections/ValueSection";
import FeasibilitySection from "../components/sections/FeasibilitySection";
import ProcessSection from "../components/sections/ProcessSection";
import CaseStudiesSection from "../components/sections/CaseStudiesSection";
import AboutSection from "../components/sections/AboutSection";
import CtaSection from "../components/sections/CtaSection";
import Footer from "../components/Footer";

const Index = () => {
  useEffect(() => {
    // Set the page title and description
    document.title = "SASsolutions.ai - AI Automation That Delivers Growth";
  }, []);

  return (
    <div className="min-h-screen bg-sas-black text-sas-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <ServicesSection />
      <ValueSection />
      <FeasibilitySection />
      <ProcessSection />
      <CaseStudiesSection />
      <AboutSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
