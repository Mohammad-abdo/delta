import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Quote, Sparkles } from "lucide-react";
import chairmanImage from "@/assets/chairman.jpeg";

/**
 * CEO Message Section Component
 * 
 * Modern design showcasing the CEO's message with a full-height portrait image
 * and elegant content layout.
 */
const CEOMessageSection = () => {
  const { t } = useTranslation();
  return (
    <section id="ceo-message" className="relative py-24 md:py-32 bg-gradient-to-br from-white via-muted/20 to-white overflow-hidden">
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
              <span className="text-sm font-medium text-primary">{t("ceoMessage.tag")}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-6">
              {t("ceoMessage.title")}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {t("ceoMessage.name")}
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground">
                {t("ceoMessage.position")}
              </p>
            </div>
          </div>

          {/* Main Content - Modern Layout */}
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Chairman Image - Full Height */}
            <div className="lg:col-span-1">
              <div className="relative group">
                {/* Decorative Border */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                
                {/* Image Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">
                  <img
                    src={chairmanImage}
                    alt="الدكتور أيمن خليل الساعي - العضو المنتدب التنفيذي"
                    className="w-full h-full min-h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>

            {/* CEO Message - Modern Card */}
            <div className="lg:col-span-2">
              <Card className="p-8 md:p-12 shadow-2xl border-0 bg-gradient-to-br from-white via-white to-primary/5 relative overflow-hidden">
                {/* Decorative Corner Gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-full"></div>
                
                {/* Quote Icon */}
                <Quote className="absolute top-8 right-8 w-16 h-16 text-primary/10" />
                
                <div className="relative space-y-6 text-lg md:text-xl leading-relaxed text-foreground">
                  <p className="font-medium">
                    {t("ceoMessage.paragraphs.1")}
                  </p>

                  <p>
                    {t("ceoMessage.paragraphs.2")}
                  </p>

                  <p>
                    {t("ceoMessage.paragraphs.3")}
                  </p>

                  <p>
                    {t("ceoMessage.paragraphs.4")}
                  </p>

                  <p>
                    {t("ceoMessage.paragraphs.5")}
                  </p>

                  <p>
                    {t("ceoMessage.paragraphs.6")}
                  </p>

                  <div className="pt-6 border-t border-primary/10">
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {t("ceoMessage.closing")}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CEOMessageSection;
