
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SLogo from "../components/SLogo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    document.title = "Page Not Found - SASsolutions.ai";
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-sas-black text-sas-white">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center py-32">
        <div className="text-center px-6">
          <div className="mb-8 flex justify-center">
            <SLogo className="w-20 h-20" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-4 text-sas-emerald">404</h1>
          <p className="text-xl text-sas-white/80 mb-8">The page you're looking for doesn't exist.</p>
          <a href="/" className="btn-primary inline-block">
            Return Home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
