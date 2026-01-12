import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

/**
 * Preloader Component
 * 
 * Displays a loading screen with animated logo before the main content loads.
 * Includes smooth fade-out animation when loading is complete.
 * 
 * @param isLoading - Boolean to control visibility of the preloader
 * @param onLoadingComplete - Callback function when loading is complete
 */
interface PreloaderProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

const Preloader = ({ isLoading, onLoadingComplete }: PreloaderProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Delay fade-out for smooth transition
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onLoadingComplete) {
          onLoadingComplete();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        {/* Animated Circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse delay-300" />
      </div>

      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Main Logo with Multiple Animations */}
        <div className="relative mb-6">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl animate-ping" />
          
          {/* Rotating Ring */}
          <div className="absolute -inset-4 border-4 border-white/20 rounded-full animate-spin-slow" />
          
          {/* Logo Image */}
          <div className="relative animate-bounce-slow">
            <img
              src={logo}
              alt="مصانع الدلتا للصلب"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl animate-pulse"
            />
          </div>
        </div>

        {/* Company Name */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 animate-fade-in">
          مصانع الدلتا للصلب
        </h2>

        {/* Loading Dots */}
        <div className="flex items-center gap-2 mt-4">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
};

export default Preloader;



