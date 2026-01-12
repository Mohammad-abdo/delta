import { Award, Factory, Globe, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import steelProducts from "@/assets/steel-products.jpg";

/**
 * About Section Component
 * 
 * Modern and creative design showcasing company information,
 * features, and statistics with engaging visual elements.
 */
const AboutSection = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: Factory,
      title: t("about.highlights.experience"),
      description: t("about.highlights.experienceDesc"),
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: Award,
      title: t("about.highlights.diverseProducts"),
      description: t("about.highlights.diverseProductsDesc"),
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: Globe,
      title: t("about.highlights.strategicService"),
      description: t("about.highlights.strategicServiceDesc"),
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: TrendingUp,
      title: t("about.highlights.innovation"),
      description: t("about.highlights.innovationDesc"),
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
  ];

  const stats = [
    { number: t("about.stats.experience"), label: t("about.stats.experienceLabel"), icon: Factory },
    { number: t("about.stats.products"), label: t("about.stats.productsLabel"), icon: Award },
    { number: t("about.stats.iso"), label: t("about.stats.isoLabel"), icon: Globe },
    { number: t("about.stats.satisfaction"), label: t("about.stats.satisfactionLabel"), icon: TrendingUp },
  ];

  const highlights = [
    t("about.features.steelBillets"),
    t("about.features.castings"),
    t("about.features.strategicSectors"),
    t("about.features.qualityStandards"),
  ];

  return (
    <section id="about" className="relative pt-12 md:pt-16 pb-24 md:pb-32 bg-gradient-to-b from-white via-muted/30 to-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header - Modern Design */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("about.tag")}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
              {t("about.title")}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("about.subtitle")}
            </p>
          </div>

          {/* Main Content - Split Layout */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-12">
            {/* Left Side - Text Content */}
            <div className="space-y-8 animate-slide-in-right">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                  {t("about.companyName")}
                </h3>
                <p className="text-lg md:text-xl leading-relaxed text-foreground">
                  {t("about.companyDescription")}
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-all mt-1">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-base md:text-lg text-foreground flex-1 pt-1">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Image with Modern Frame */}
            <div className="relative animate-fade-in">
              <div className="relative group">
                {/* Decorative Border */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                
                {/* Image Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">
                  <img
                    src={steelProducts}
                    alt="منتجات الصلب والمسبوكات"
                    className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <Award className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{t("about.stats.iso")}</div>
                      <div className="text-sm text-muted-foreground">{t("about.stats.isoLabel")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section - Modern Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="relative p-6 bg-white/80 backdrop-blur-sm border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 overflow-hidden"
                >
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-all">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm md:text-base text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Features Grid - Modern Design */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="relative p-8 bg-white border border-primary/10 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02] overflow-hidden"
                >
                  {/* Animated Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative flex items-start gap-6">
                    {/* Icon Container */}
                    <div className={`${feature.iconBg} p-5 rounded-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <Icon className={`w-10 h-10 ${feature.iconColor}`} />
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 group-hover:text-primary/90 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Decorative Corner Element */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
