
import SLogo from "./SLogo";

const Footer = () => {
  return (
    <footer className="py-16 bg-sas-darkGray/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center mb-8 md:mb-0">
            <SLogo className="w-12 h-12" animated={false} />
            <span className="ml-2 text-xl font-serif font-bold text-sas-emerald">SASsolutions<span className="text-sas-white">.ai</span></span>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-8">
            <a href="#services" className="text-sm text-sas-white/70 hover:text-sas-emerald transition-colors">Services</a>
            <a href="#values" className="text-sm text-sas-white/70 hover:text-sas-emerald transition-colors">Value</a>
            <a href="#process" className="text-sm text-sas-white/70 hover:text-sas-emerald transition-colors">Process</a>
            <a href="#case-studies" className="text-sm text-sas-white/70 hover:text-sas-emerald transition-colors">Case Studies</a>
            <a href="#about" className="text-sm text-sas-white/70 hover:text-sas-emerald transition-colors">About</a>
            <a href="#contact" className="text-sm text-sas-white/70 hover:text-sas-emerald transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="border-t border-sas-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-sas-white/50 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SASsolutions.ai. All rights reserved.
          </div>
          
          <div className="flex space-x-6 items-center">
            <a href="#" className="text-sas-white/50 hover:text-sas-emerald transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-sas-white/50 hover:text-sas-emerald transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-sas-white/50 hover:text-sas-emerald transition-colors">
              <span className="sr-only">Email</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path fillRule="evenodd" d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
