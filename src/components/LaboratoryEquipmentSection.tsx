import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Beaker, Microscope, Filter } from "lucide-react";
import { staticLaboratoryEquipment } from "@/data/laboratoryEquipment";

/**
 * LaboratoryEquipmentSection Component
 * 
 * Displays a section showcasing laboratory equipment with images and names.
 * Includes scroll animations for better user experience.
 * 
 * @returns JSX element containing laboratory equipment section
 */
const LaboratoryEquipmentSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    if (sectionRef.current) {
      sectionRef.current.classList.add("opacity-0", "transition-opacity", "duration-700");
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Use static data directly
  const equipment = staticLaboratoryEquipment;

  // Get icon based on equipment name
  const getIcon = (name: string) => {
    if (name.includes("ميكروسكوب") || name.includes("ميكروسكوب")) return Microscope;
    if (name.includes("نخل") || name.includes("رمل") || name.includes("فلتر")) return Filter;
    return Beaker;
  };

  return (
    <section
      ref={sectionRef}
      className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-b from-white via-muted/10 to-white"
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12 px-2">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-primary/10 rounded-full mb-2 sm:mb-3 md:mb-4">
              <Beaker className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2 sm:mb-3 md:mb-4">
              أجهزة المعامل
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
              نستخدم أحدث الأجهزة والمعدات المتطورة في معاملنا لضمان أعلى معايير الجودة
              والتحليل الدقيق للمواد الخام والمنتجات النهائية
            </p>
          </div>

          {/* Equipment Grid */}
          {equipment.length === 0 ? (
            <div className="text-center py-12">
              <Beaker className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد أجهزة متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {equipment.slice(0, 6).map((item: any, index: number) => {
                const Icon = getIcon(item.name || '');
                
                // Creative color schemes for each card
                const cardThemes = [
                  { 
                    gradient: "from-blue-500 via-blue-600 to-blue-700",
                    bg: "bg-blue-500",
                    text: "text-white",
                    accent: "bg-white/20",
                    border: "border-blue-300",
                  },
                  { 
                    gradient: "from-cyan-500 via-cyan-600 to-cyan-700",
                    bg: "bg-cyan-500",
                    text: "text-white",
                    accent: "bg-white/20",
                    border: "border-cyan-300",
                  },
                  { 
                    gradient: "from-teal-500 via-teal-600 to-teal-700",
                    bg: "bg-teal-500",
                    text: "text-white",
                    accent: "bg-white/20",
                    border: "border-teal-300",
                  },
                  { 
                    gradient: "from-indigo-500 via-indigo-600 to-indigo-700",
                    bg: "bg-indigo-500",
                    text: "text-white",
                    accent: "bg-white/20",
                    border: "border-indigo-300",
                  },
                  { 
                    gradient: "from-purple-500 via-purple-600 to-purple-700",
                    bg: "bg-purple-500",
                    text: "text-white",
                    accent: "bg-white/20",
                    border: "border-purple-300",
                  },
                  { 
                    gradient: "from-pink-500 via-pink-600 to-pink-700",
                    bg: "bg-pink-500",
                    text: "text-white",
                    accent: "bg-white/20",
                    border: "border-pink-300",
                  },
                ];
                
                const theme = cardThemes[index % cardThemes.length];

                return (
                  <div
                    key={item.id || index}
                    className="group relative block h-full"
                  >
                    <div className={`relative h-full rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 ${theme.border} bg-gradient-to-br ${theme.gradient}`}>
                      {/* Decorative Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div 
                          className="absolute inset-0" 
                          style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                            backgroundSize: '32px 32px'
                          }} 
                        />
                      </div>

                      {/* Top Accent Circle */}
                      <div className={`absolute -top-12 -right-12 w-32 h-32 ${theme.accent} rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />

                      {/* Content */}
                      <div className="relative z-10 p-3 sm:p-4 md:p-6 flex flex-col h-full">
                        {/* Equipment Image Container */}
                        <div className="relative mb-3 sm:mb-4 md:mb-6 flex-shrink-0">
                          <div className="relative h-40 sm:h-48 md:h-56 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-white/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                            <div className="relative h-full flex items-center justify-center p-3 sm:p-4 md:p-6">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-lg"
                                />
                              ) : (
                                <Icon className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 text-white/60 group-hover:scale-110 transition-transform duration-700" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Equipment Info */}
                        <div className="flex-1 flex flex-col">
                          {/* Equipment Name */}
                          <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${theme.text} mb-1.5 sm:mb-2 md:mb-3 group-hover:scale-105 transition-transform duration-300`}>
                            {item.name}
                          </h3>
                          
                          {/* Description */}
                          {item.description && (
                            <p className={`${theme.text}/90 leading-relaxed text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6 flex-1 line-clamp-3`}>
                              {item.description}
                            </p>
                          )}

                          {/* Bottom Badge */}
                          <div className="flex items-center justify-between pt-2 sm:pt-3 md:pt-4 border-t border-white/20">
                            <span className={`text-xs sm:text-sm ${theme.text}/80 font-medium`}>
                              جهاز معمل
                            </span>
                            <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full ${theme.accent} group-hover:scale-125 transition-transform duration-300`} />
                          </div>
                        </div>
                      </div>

                      {/* Hover Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-3xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>

                      {/* Corner Decoration */}
                      <div className={`absolute top-0 right-0 w-16 h-16 ${theme.accent} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All Link */}
          {equipment.length > 6 && (
            <div className="text-center mt-8 sm:mt-10 md:mt-12">
              <Link
                to="/laboratory-equipment"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <span>عرض جميع الأجهزة</span>
                <Beaker className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LaboratoryEquipmentSection;

