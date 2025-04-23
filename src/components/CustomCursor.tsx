
import { useState, useEffect } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    const handleLinkHover = () => setIsLinkHovered(true);
    const handleLinkLeave = () => setIsLinkHovered(false);
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    const links = document.querySelectorAll("a, button");
    links.forEach(link => {
      link.addEventListener("mouseenter", handleLinkHover);
      link.addEventListener("mouseleave", handleLinkLeave);
    });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      
      links.forEach(link => {
        link.removeEventListener("mouseenter", handleLinkHover);
        link.removeEventListener("mouseleave", handleLinkLeave);
      });
    };
  }, [isVisible]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed pointer-events-none z-50 transition-transform duration-100 ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isClicking ? "scale-75" : ""} ${isLinkHovered ? "scale-150" : ""}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)"
        }}
      >
        <div className="w-5 h-5 rounded-full border border-sas-emerald mix-blend-difference"></div>
      </div>
      <div
        className={`fixed pointer-events-none z-50 transition-transform duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isClicking ? "scale-75" : ""} ${isLinkHovered ? "scale-125" : ""}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)"
        }}
      >
        <div className="w-1 h-1 bg-sas-emerald rounded-full mix-blend-difference"></div>
      </div>
    </>
  );
};

export default CustomCursor;
