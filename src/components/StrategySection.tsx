import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import {
  Award,
  Lightbulb,
  Leaf,
  Shield,
  Users,
  Network,
  Sparkles,
} from "lucide-react";

/**
 * Strategy Section Component
 * 
 * Modern design showcasing company strategies with gradient backgrounds
 * and contemporary visual elements.
 */
const StrategySection = () => {
  const { t } = useTranslation();
  const strategies = [
    {
      number: "01",
      icon: Award,
      title: t("strategy.strategies.quality.title"),
      description: t("strategy.strategies.quality.description"),
      gradient: "from-primary via-primary/90 to-primary/80",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      bgGradient: "from-primary/10 via-primary/5 to-transparent",
    },
    {
      number: "02",
      icon: Lightbulb,
      title: t("strategy.strategies.innovation.title"),
      description: t("strategy.strategies.innovation.description"),
      gradient: "from-yellow-500 via-yellow-400 to-yellow-300",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-600",
      bgGradient: "from-yellow-500/10 via-yellow-500/5 to-transparent",
    },
    {
      number: "03",
      icon: Leaf,
      title: t("strategy.strategies.sustainability.title"),
      description: t("strategy.strategies.sustainability.description"),
      gradient: "from-green-600 via-green-500 to-green-400",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
      bgGradient: "from-green-500/10 via-green-500/5 to-transparent",
    },
    {
      number: "04",
      icon: Shield,
      title: t("strategy.strategies.safety.title"),
      description: t("strategy.strategies.safety.description"),
      gradient: "from-blue-600 via-blue-500 to-blue-400",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      bgGradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    },
    {
      number: "05",
      icon: Users,
      title: t("strategy.strategies.hr.title"),
      description: t("strategy.strategies.hr.description"),
      gradient: "from-purple-600 via-purple-500 to-purple-400",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      bgGradient: "from-purple-500/10 via-purple-500/5 to-transparent",
    },
    {
      number: "06",
      icon: Network,
      title: t("strategy.strategies.integration.title"),
      description: t("strategy.strategies.integration.description"),
      gradient: "from-indigo-600 via-indigo-500 to-indigo-400",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
      bgGradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    },
  ];

  return (
    <section id="strategy" className="relative py-24 md:py-32 bg-gradient-to-br from-white via-muted/20 to-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header - Modern Design */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("strategy.tag")}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-6">
              {t("strategy.title")}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {t("strategy.intro")}
            </p>
          </div>

          {/* Strategies Grid - Modern Design */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strategy, index) => {
              const Icon = strategy.icon;
              return (
                <Card
                  key={index}
                  className="relative p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-0 group hover:scale-[1.02] overflow-hidden"
                >
                  {/* Background Gradient - Different for first card */}
                  {index === 0 ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 opacity-100"></div>
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${strategy.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  )}

                  {/* Number Badge */}
                  <div className="absolute top-4 right-4 text-5xl font-bold opacity-5 group-hover:opacity-10 transition-opacity">
                    {strategy.number}
                  </div>

                  <div className="relative">
                    {/* Icon Container */}
                    <div className={`${strategy.iconBg} p-4 rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-10 h-10 ${strategy.iconColor}`} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-primary mb-3 leading-tight group-hover:text-primary/90 transition-colors">
                      {strategy.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed text-base group-hover:text-foreground transition-colors">
                      {strategy.description}
                    </p>
                  </div>

                  {/* Decorative Corner Element */}
                  <div className={`absolute top-0 left-0 w-20 h-20 bg-gradient-to-br ${strategy.bgGradient} rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </Card>
              );
            })}
          </div>

          {/* Bottom Note - Modern Design */}
          <div className="mt-16 text-center">
            <div className="inline-block p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20">
              <p className="text-lg md:text-xl text-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                {t("strategy.commitment")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategySection;
