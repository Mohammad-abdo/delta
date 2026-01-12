import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VisionMissionSection from "@/components/VisionMissionSection";
import StrategySection from "@/components/StrategySection";
import QualityPolicySection from "@/components/QualityPolicySection";
import CEOMessageSection from "@/components/CEOMessageSection";
import { Factory, Award, Zap, TrendingUp } from "lucide-react";

/**
 * Home Page
 * 
 * The main landing page that displays all sections of the website.
 * This page serves as an overview of the company.
 * Enhanced with scroll animations and smooth transitions.
 */
const Home = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          entry.target.classList.remove("opacity-0");
        }
      });
    }, observerOptions);

    sectionsRef.current.forEach((section) => {
      if (section) {
        section.classList.add("opacity-0", "transition-opacity", "duration-700");
        observer.observe(section);
      }
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  // Handle hash/state navigation when page loads or hash/state changes
  useEffect(() => {
    // التحقق من sessionStorage أولاً
    const scrollToSection = sessionStorage.getItem("scrollToSection");
    const state = (location.state as { scrollTo?: string } | null) || {};
    const targetId = location.hash.replace("#", "") || scrollToSection || state.scrollTo;
    
    if (!targetId) return;

    // مسح القيمة من sessionStorage
    if (scrollToSection) {
      sessionStorage.removeItem("scrollToSection");
    }

    // Wait for DOM to be ready after navigation
    const scrollToElement = () => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `#${targetId}`);
      } else {
        // Retry after longer delay
        setTimeout(() => {
          const retryElement = document.getElementById(targetId);
          if (retryElement) {
            retryElement.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.replaceState(null, "", `#${targetId}`);
          }
        }, 300);
      }
    };
    
    setTimeout(scrollToElement, 200);
  }, [location.hash, location.state]);

  const statsItems = [
    { label: t("home.stats.experience"), desc: t("home.stats.experienceDesc"), icon: Factory },
    { label: t("home.stats.quality"), desc: t("home.stats.qualityDesc"), icon: Award },
    { label: t("home.stats.innovation"), desc: t("home.stats.innovationDesc"), icon: Zap },
    { label: t("home.stats.service"), desc: t("home.stats.serviceDesc"), icon: TrendingUp },
  ];

  return (
    <div className="relative">
      {/* Hero Section - Full Screen */}
      <div className="relative" style={{ marginTop: '-80px', paddingTop: '100px' }}>
        <div className="sm:hidden">
          <HeroSection />
        </div>
        <div className="hidden sm:block" style={{ marginTop: '-120px', paddingTop: '140px' }}>
          <HeroSection />
        </div>
      </div>

      {/* Stats Section - Separated from Hero */}
      <section className="relative bg-gradient-to-b from-white via-muted/20 to-white py-8 sm:py-12 md:py-16 -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {statsItems.map((item, index) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={index}
                  className="text-center group cursor-pointer"
                >
                  {/* Large Circle with Icon */}
                  <div className="relative inline-flex items-center justify-center mb-4">
                    {/* Outer Glow */}
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all" />
                    
                    {/* Main Circle */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full border-2 border-primary/20 group-hover:border-primary/40 shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                      <ItemIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Text */}
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-primary mb-1 sm:mb-2 group-hover:text-primary/80 transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Main Content Sections with Smooth Transitions */}
      <div 
        ref={(el) => (sectionsRef.current[0] = el)}
        className="opacity-0"
      >
        <AboutSection />
      </div>
      
      <div 
        ref={(el) => (sectionsRef.current[1] = el)}
        className="opacity-0"
      >
        <VisionMissionSection />
      </div>
      
      <div 
        ref={(el) => (sectionsRef.current[2] = el)}
        className="opacity-0"
      >
        <StrategySection />
      </div>
      
      <div 
        ref={(el) => (sectionsRef.current[3] = el)}
        className="opacity-0"
      >
        <QualityPolicySection />
      </div>
      
      <div 
        ref={(el) => (sectionsRef.current[4] = el)}
        className="opacity-0"
      >
        <CEOMessageSection />
      </div>
    </div>
  );
};

export default Home;

