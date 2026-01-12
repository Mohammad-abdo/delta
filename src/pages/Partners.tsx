import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import part1 from "@/assets/part1.jpeg";
import part2 from "@/assets/part2.jpeg";
import part3 from "@/assets/part3.jpeg";
import part4 from "@/assets/part4.jpeg";
import part5 from "@/assets/part5.jpeg";
import part6 from "@/assets/part6.jpeg";
import part7 from "@/assets/part7.jpeg";

/**
 * Partners Page
 * 
 * Displays company partners logos in an elegant gallery.
 */
const Partners = () => {
  const { t } = useTranslation();
  // Partners Logos
  const partnerLogos = [part1, part2, part3, part4, part5, part6, part7];

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20 px-2">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 rounded-full mb-4 sm:mb-6">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3 sm:mb-4 md:mb-6">
              {t("partners.title")}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("partners.subtitle")}
            </p>
          </div>

          {/* Partners Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {partnerLogos.map((logo, index) => (
              <div
                key={index}
                className="group relative aspect-square bg-white rounded-2xl border-2 border-muted hover:border-primary/50 transition-all duration-500 hover:shadow-xl overflow-hidden"
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-sky/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                
                {/* Logo Image */}
                <div className="w-full h-full flex items-center justify-center p-6 sm:p-8 relative z-0">
                  <img
                    src={logo}
                    alt={`${t("partners.partner")} ${index + 1}`}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Decorative Corner Elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-14 h-14 bg-sky/5 rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;

