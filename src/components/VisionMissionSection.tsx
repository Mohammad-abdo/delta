import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Target, Lightbulb } from "lucide-react";

const VisionMissionSection = () => {
  const { t } = useTranslation();
  return (
    <section id="vision-mission" className="py-20 gradient-section">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {t("visionMission.title")}
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <Card className="p-10 shadow-medium hover:shadow-strong transition-base border-0 bg-white group hover:scale-[1.02]">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-6 rounded-2xl mb-6 group-hover:bg-primary/20 transition-base">
                  <Target className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-6">
                  {t("visionMission.vision.title")}
                </h3>
                <p className="text-lg leading-relaxed text-foreground">
                  {t("visionMission.vision.description")}
                </p>
              </div>
            </Card>

            {/* Mission Card */}
            <Card className="p-10 shadow-medium hover:shadow-strong transition-base border-0 bg-white group hover:scale-[1.02]">
              <div className="flex flex-col items-center text-center">
                <div className="bg-accent/10 p-6 rounded-2xl mb-6 group-hover:bg-accent/20 transition-base">
                  <Lightbulb className="w-12 h-12 text-accent" />
                </div>
                <h3 className="text-3xl font-bold text-accent mb-6">
                  {t("visionMission.mission.title")}
                </h3>
                <p className="text-lg leading-relaxed text-foreground">
                  {t("visionMission.mission.description")}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
