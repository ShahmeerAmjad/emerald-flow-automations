
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-sas-black/90 backdrop-blur-md py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <div className="relative w-12 h-12">
            <svg viewBox="0 0 100 160" className="w-full h-full fill-none emerald-glow">
              <path
                className={`emerald-line ${isScrolled ? "" : "animated-emerald-line"}`}
                d="M50,10 C70,30 80,40 70,70 C60,100 30,110 30,130 C30,150 50,150 50,150"
              />
            </svg>
          </div>
          <span className="ml-2 text-xl font-serif font-bold text-sas-emerald">SASsolutions<span className="text-sas-white">.ai</span></span>
        </a>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#services" className="text-sm font-medium text-sas-white hover:text-sas-emerald transition-colors">Services</a>
          <a href="#values" className="text-sm font-medium text-sas-white hover:text-sas-emerald transition-colors">Value</a>
          <a href="#process" className="text-sm font-medium text-sas-white hover:text-sas-emerald transition-colors">Process</a>
          <a href="#about" className="text-sm font-medium text-sas-white hover:text-sas-emerald transition-colors">About</a>
          <a href="#contact" className="btn-secondary text-sm py-2 px-5">Get Started</a>
        </nav>
        
        <button className="md:hidden text-sas-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-sas-black/95 backdrop-blur-md absolute w-full">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-6">
            <a href="#services" className="text-sm font-medium text-sas-white hover:text-sas-emerald transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
            <a href="#values" className="text-sm font-medium text-sas-white hover:text-sas-emerald transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Value</a>
            <a href="#process" className="text-sm font-medium text-sas-white hover:text-sas-emerald transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Process</a>
            <a href="#about" className="text-sm font-medium text-sas-white hover:text-sas-emerald transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#contact" className="btn-secondary text-center text-sm py-2" onClick={() => setIsMobileMenuOpen(false)}>Get Started</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
