
import React from "react";

interface SLogoProps {
  className?: string;
  animated?: boolean;
}

const SLogo: React.FC<SLogoProps> = ({ className = "w-20 h-20", animated = true }) => {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 160" className="w-full h-full fill-none emerald-glow">
        <path
          className={`emerald-line ${animated ? "animated-emerald-line" : ""}`}
          d="M50,10 C70,30 80,40 70,70 C60,100 30,110 30,130 C30,150 50,150 50,150"
        />
      </svg>
    </div>
  );
};

export default SLogo;
