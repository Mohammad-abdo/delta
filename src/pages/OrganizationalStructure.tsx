import React, { useRef, useEffect } from "react";
import { Building2, Crown, Briefcase, ChevronDown } from "lucide-react";
import chairmanImage from "@/assets/chairman.jpg";

/**
 * OrganizationalStructure Page
 * 
 * Displays the company's organizational structure as a creative hierarchical chart.
 * Shows different management levels with connecting lines in a tree structure.
 * Includes employee photos in the organizational chart.
 * 
 * @returns JSX element containing organizational structure page
 */
const OrganizationalStructure = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Hierarchical organizational structure
  const orgChart = {
    top: {
      title: "رئيس مجلس الإدارة",
      icon: Crown,
      color: "from-primary via-primary/90 to-primary",
      bg: "bg-primary",
      image: chairmanImage,
    },
    level1: [
      {
        title: "العضو المنتدب التنفيذي",
        icon: Building2,
        color: "from-sky via-sky/90 to-sky",
        bg: "bg-sky",
        image: chairmanImage,
      },
    ],
    level2: [
      {
        title: "مدير الإنتاج",
        icon: Briefcase,
        color: "from-secondary via-secondary/90 to-secondary",
        bg: "bg-secondary",
        image: chairmanImage,
        departments: ["قسم الإنتاج", "قسم الصيانة"],
      },
      {
        title: "مدير الجودة",
        icon: Briefcase,
        color: "from-primary/80 via-primary to-primary/80",
        bg: "bg-primary",
        image: chairmanImage,
        departments: ["قسم الجودة والرقابة", "قسم السلامة والبيئة"],
      },
      {
        title: "مدير المبيعات",
        icon: Briefcase,
        color: "from-sky/80 via-sky to-sky/80",
        bg: "bg-sky",
        image: chairmanImage,
        departments: ["قسم المبيعات والتسويق"],
      },
      {
        title: "مدير الموارد البشرية",
        icon: Briefcase,
        color: "from-secondary/80 via-secondary to-secondary/80",
        bg: "bg-secondary",
        image: chairmanImage,
        departments: ["قسم الموارد البشرية", "وحدة التدريب", "وحدة العلاقات العامة"],
      },
      {
        title: "مدير المالية",
        icon: Briefcase,
        color: "from-primary/70 via-primary/90 to-primary/70",
        bg: "bg-primary",
        image: chairmanImage,
        departments: ["قسم المحاسبة والمالية", "قسم المشتريات", "وحدة التخطيط"],
      },
    ],
  };

  const PositionCard = ({ 
    title, 
    icon: Icon, 
    gradient, 
    bg, 
    level = 0,
    departments = [],
    image
  }: {
    title: string;
    icon: any;
    gradient: string;
    bg: string;
    level?: number;
    departments?: string[];
    image?: string;
  }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
      <div className="relative group">
        {/* Position Card */}
        <div
          className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-white/20 min-w-[200px] sm:min-w-[240px]`}
        >
          {/* Employee Photo */}
          {image && (
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-lg ring-4 ring-white/20">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Icon Badge */}
                <div className="absolute -bottom-1 -right-1 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg border-2 border-white">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <h3 className="text-white font-bold text-base sm:text-lg md:text-xl text-center mb-2">
            {title}
          </h3>

          {/* Expand Button for Departments */}
          {departments.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-2 text-white/90 hover:text-white transition-colors text-xs sm:text-sm mt-2"
            >
              <span>{isExpanded ? "إخفاء" : "عرض"} الأقسام</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          {/* Departments List */}
          {isExpanded && departments.length > 0 && (
            <div className="mt-4 space-y-2 animate-in slide-in-from-top-2">
              {departments.map((dept, idx) => (
                <div
                  key={idx}
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center text-white text-xs sm:text-sm"
                >
                  {dept}
                </div>
              ))}
            </div>
          )}

          {/* Decorative Elements */}
          <div className="absolute top-2 right-2 w-3 h-3 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-muted/10 to-white py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-3 sm:mb-4">
              الهيكل التنظيمي
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              يعكس الهيكل التنظيمي لشركة مصانع الدلتا للصلب التزامنا بالكفاءة
              والتنظيم في جميع مستويات الإدارة
            </p>
          </div>

          {/* Desktop View - Hierarchical Chart */}
          <div ref={sectionRef} className="hidden lg:block relative pb-8">
            <div className="w-full">
              {/* Top Level - Chairman */}
              <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
                <PositionCard
                  title={orgChart.top.title}
                  icon={orgChart.top.icon}
                  gradient={orgChart.top.color}
                  bg={orgChart.top.bg}
                  level={0}
                  image={orgChart.top.image}
                />
              </div>

              {/* Connecting Line - Top to Level 1 */}
              <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
                <div className="w-1.5 h-10 sm:h-14 md:h-16 bg-gradient-to-b from-primary via-primary/80 to-sky rounded-full shadow-lg" />
              </div>

              {/* Level 1 - CEO */}
              <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
                <PositionCard
                  title={orgChart.level1[0].title}
                  icon={orgChart.level1[0].icon}
                  gradient={orgChart.level1[0].color}
                  bg={orgChart.level1[0].bg}
                  level={1}
                  image={orgChart.level1[0].image}
                />
              </div>

              {/* Connecting Lines - Level 1 to Level 2 */}
              <div className="flex justify-center mb-6 sm:mb-8 md:mb-12 relative">
                <div className="relative w-full max-w-6xl">
                  {/* Vertical Line */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-10 sm:h-14 md:h-16 bg-gradient-to-b from-sky via-sky/80 to-secondary/50 rounded-full shadow-lg" />
                  
                  {/* Horizontal Line */}
                  <div 
                    className="absolute top-10 sm:top-14 md:top-16 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-sky/60 to-transparent" 
                    style={{ width: 'calc(100% - 240px)' }}
                  />
                </div>
              </div>

              {/* Level 2 - Directors */}
              <div className="mb-8 sm:mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 relative">
                  {orgChart.level2.map((director, index) => (
                    <div key={index} className="flex justify-center">
                      <div className="relative w-full">
                        {/* Connecting Line from Top */}
                        <div className="absolute -top-10 sm:-top-14 md:-top-16 left-1/2 -translate-x-1/2 w-1.5 h-10 sm:h-14 md:h-16 bg-gradient-to-b from-sky/60 via-secondary/40 to-transparent rounded-full" />
                        
                        <div className="flex justify-center">
                          <PositionCard
                            title={director.title}
                            icon={director.icon}
                            gradient={director.color}
                            bg={director.bg}
                            level={2}
                            departments={director.departments}
                            image={director.image}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View - List/Accordion Style */}
          <div className="lg:hidden space-y-4">
            {/* Top Level - Chairman */}
            <div className="bg-gradient-to-br from-primary via-primary/90 to-primary rounded-2xl p-4 shadow-lg border-2 border-white/20">
              <div className="flex items-center gap-4">
                {orgChart.top.image && (
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white/30 shadow-lg ring-2 ring-white/20">
                      <img
                        src={orgChart.top.image}
                        alt={orgChart.top.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg border-2 border-white">
                      <Crown className="w-3.5 h-3.5 text-primary" />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1">{orgChart.top.title}</h3>
                  <div className="w-12 h-0.5 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>

            {/* Level 1 - CEO */}
            <div className="bg-gradient-to-br from-sky via-sky/90 to-sky rounded-2xl p-4 shadow-lg border-2 border-white/20">
              <div className="flex items-center gap-4">
                {orgChart.level1[0].image && (
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white/30 shadow-lg ring-2 ring-white/20">
                      <img
                        src={orgChart.level1[0].image}
                        alt={orgChart.level1[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg border-2 border-white">
                      <Building2 className="w-3.5 h-3.5 text-sky" />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1">{orgChart.level1[0].title}</h3>
                  <div className="w-12 h-0.5 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>

            {/* Level 2 - Directors */}
            {orgChart.level2.map((director, index) => {
              const [isExpanded, setIsExpanded] = React.useState(false);
              const colors = [
                { gradient: "from-secondary via-secondary/90 to-secondary", iconColor: "text-secondary" },
                { gradient: "from-primary/80 via-primary to-primary/80", iconColor: "text-primary" },
                { gradient: "from-sky/80 via-sky to-sky/80", iconColor: "text-sky" },
                { gradient: "from-secondary/80 via-secondary to-secondary/80", iconColor: "text-secondary" },
                { gradient: "from-primary/70 via-primary/90 to-primary/70", iconColor: "text-primary" },
              ];
              const color = colors[index % colors.length];

              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${color.gradient} rounded-2xl shadow-lg border-2 border-white/20 overflow-hidden`}
                >
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full p-4 flex items-center gap-4"
                  >
                    {director.image && (
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-4 border-white/30 shadow-lg ring-2 ring-white/20">
                          <img
                            src={director.image}
                            alt={director.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg border-2 border-white`}>
                          <Briefcase className={`w-3 h-3 ${color.iconColor}`} />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 text-right">
                      <h3 className="text-white font-bold text-base mb-1">{director.title}</h3>
                      {director.departments && director.departments.length > 0 && (
                        <p className="text-white/70 text-xs">
                          {director.departments.length} قسم
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white transition-transform duration-300 flex-shrink-0 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Departments List */}
                  {isExpanded && director.departments && director.departments.length > 0 && (
                    <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top-2">
                      {director.departments.map((dept, idx) => (
                        <div
                          key={idx}
                          className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center text-white text-sm"
                        >
                          {dept}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-12 sm:mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-muted shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 text-center">
              شرح الهيكل التنظيمي
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-primary mb-1">الإدارة العليا</h4>
                  <p className="text-sm text-muted-foreground">
                    أعلى مستوى في الهيكل التنظيمي
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-sky mt-1.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-primary mb-1">الإدارات التنفيذية</h4>
                  <p className="text-sm text-muted-foreground">
                    المستوى الثاني من الإدارة
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-primary mb-1">الأقسام والوحدات</h4>
                  <p className="text-sm text-muted-foreground">
                    المستوى الثالث والرابع
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalStructure;
