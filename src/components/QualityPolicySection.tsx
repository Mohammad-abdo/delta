import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { CheckCircle, Shield, Leaf, HeartPulse, Award, Sparkles, CheckCircle2 } from "lucide-react";
import qualityControl from "@/assets/quality-control.jpg";

/**
 * Quality Policy Section Component
 * 
 * Modern design showcasing quality, environment, and safety policies
 * with gradient colors and contemporary visual elements.
 */
const QualityPolicySection = () => {
  const { t } = useTranslation();
  const isoStandards = [
    { 
      standard: t("quality.iso.9001.standard"), 
      label: t("quality.iso.9001.label"),
      gradient: "from-primary via-primary/90 to-primary/80",
      icon: Shield,
    },
    { 
      standard: t("quality.iso.14001.standard"), 
      label: t("quality.iso.14001.label"),
      gradient: "from-green-600 via-green-500 to-green-400",
      icon: Leaf,
    },
    { 
      standard: t("quality.iso.45001.standard"), 
      label: t("quality.iso.45001.label"),
      gradient: "from-blue-600 via-blue-500 to-blue-400",
      icon: HeartPulse,
    },
  ];

  const commitments = [
    {
      icon: Shield,
      title: t("quality.commitments.quality.title"),
      description: t("quality.commitments.quality.description"),
      gradient: "from-primary/20 via-primary/10 to-primary/5",
      iconGradient: "from-primary to-primary/80",
      color: "text-primary",
    },
    {
      icon: Leaf,
      title: t("quality.commitments.environment.title"),
      description: t("quality.commitments.environment.description"),
      gradient: "from-green-500/20 via-green-500/10 to-green-500/5",
      iconGradient: "from-green-600 to-green-400",
      color: "text-green-600",
    },
    {
      icon: HeartPulse,
      title: t("quality.commitments.safety.title"),
      description: t("quality.commitments.safety.description"),
      gradient: "from-blue-500/20 via-blue-500/10 to-blue-500/5",
      iconGradient: "from-blue-600 to-blue-400",
      color: "text-blue-600",
    },
    {
      icon: CheckCircle,
      title: t("quality.commitments.legal.title"),
      description: t("quality.commitments.legal.description"),
      gradient: "from-purple-500/20 via-purple-500/10 to-purple-500/5",
      iconGradient: "from-purple-600 to-purple-400",
      color: "text-purple-600",
    },
  ];

  const supportPoints = [
    t("quality.support.points.resources"),
    t("quality.support.points.suppliers"),
    t("quality.support.points.technology"),
    t("quality.support.points.employees"),
    t("quality.support.points.knowledge"),
  ];

  return (
    <section id="quality" className="relative py-24 md:py-32 bg-gradient-to-br from-primary/5 via-white to-primary/5 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header - Modern Design */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("quality.tag")}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-6">
              {t("quality.title")}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("quality.subtitle")}
            </p>
          </div>

          {/* Quality Image with Gradient Overlay */}
          <div className="mb-16 animate-fade-in">
            <div className="relative group">
              {/* Decorative Border */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-green-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">
                <img
                  src={qualityControl}
                  alt="مراقبة الجودة - شركة مصانع الدلتا للصلب"
                  className="w-full h-[450px] object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/10 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* ISO Badges - Modern Gradient Design */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {isoStandards.map((iso, index) => {
              const Icon = iso.icon;
              return (
                <Badge
                  key={index}
                  className={`px-6 py-4 text-base bg-gradient-to-r ${iso.gradient} text-white transition-all duration-300 group-hover:scale-105 border-0 shadow-none`}
                >
                  <Icon className="w-5 h-5 ml-2" />
                  <div className="flex flex-col items-start">
                    <span className="font-bold">{iso.standard}</span>
                    <span className="text-xs opacity-90">{iso.label}</span>
                  </div>
                </Badge>
              );
            })}
          </div>

          {/* Main Content Card - Modern Design */}
          <Card className="p-8 md:p-12 shadow-2xl border-0 bg-gradient-to-br from-white via-white to-primary/5 mb-16 relative overflow-hidden">
            {/* Decorative Corner Gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-500/10 to-transparent rounded-tr-full"></div>
            
            <div className="relative space-y-6 text-lg leading-relaxed text-foreground">
              <p className="text-xl md:text-2xl font-medium text-primary/90">
                {t("quality.intro")}
              </p>

              <p>
                {t("quality.commitmentText")}
              </p>

              <p>
                {t("quality.review")}
              </p>

              {/* Support Points - Modern List */}
              <div className="my-10 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-white to-green-500/5 border border-primary/10">
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
                  {t("quality.support.title")}
                </h3>
                <ul className="space-y-4">
                  {supportPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="bg-gradient-to-br from-primary to-primary/80 p-2 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0 mt-1">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-base md:text-lg text-foreground flex-1 pt-1 leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p>
                {t("quality.sustainability")}
              </p>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-green-500/10 border border-primary/20">
                <p className="font-semibold text-lg text-primary leading-relaxed">
                  {t("quality.policyStatement")}
                </p>
              </div>
            </div>
          </Card>

          {/* Commitments Grid - Modern Gradient Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commitments.map((commitment, index) => {
              const Icon = commitment.icon;
              return (
                <Card
                  key={index}
                  className="relative p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 group hover:scale-105 border-0 overflow-hidden"
                >
                  {/* Animated Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${commitment.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Icon Container with Gradient */}
                  <div className="relative mb-6">
                    <div className={`inline-flex items-center justify-center p-5 rounded-2xl bg-gradient-to-br ${commitment.iconGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    <h3 className={`text-xl font-bold ${commitment.color} mb-3 group-hover:text-foreground transition-colors`}>
                      {commitment.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                      {commitment.description}
                    </p>
                  </div>

                  {/* Decorative Corner Element */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${commitment.gradient} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualityPolicySection;
