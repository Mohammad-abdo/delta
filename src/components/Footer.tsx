import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Linkedin, Facebook, Youtube, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.png";
import { useQuery } from "@tanstack/react-query";
import { publicSettingsAPI, defaultSettingsData } from "@/lib/api";

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

/**
 * Footer Component
 * 
 * Site footer that appears at the bottom of all pages.
 * Contains company information, quick links, contact info, and Google Maps.
 * Uses React Router Links for navigation.
 */
const Footer = () => {
  const { t } = useTranslation();
  const { data: settings } = useQuery({
    queryKey: ["public-settings"],
    queryFn: publicSettingsAPI.get,
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry on 404
    refetchOnWindowFocus: false,
  });

  const mergedSettings = settings || defaultSettingsData;
  const contact = mergedSettings.contact || defaultSettingsData.contact;
  const social = mergedSettings.socialMedia || defaultSettingsData.socialMedia;
  const siteName = mergedSettings.siteName || defaultSettingsData.siteName;

  return (
    <footer className="bg-primary text-primary-foreground py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                <img
                  src={logo}
                  alt="مصانع الدلتا للصلب"
                  className="h-7 w-auto sm:h-9 md:h-10 object-contain"
                />
                <span className="text-base sm:text-lg md:text-xl font-bold">{siteName}</span>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-primary-foreground/80 leading-relaxed">
                {t("footer.companyDescription")}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 md:mb-4">{t("footer.quickLinks")}</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base">
                <li>
                  <Link
                    to="/about"
                    className="text-primary-foreground/80 hover:text-white transition-fast block py-1"
                  >
                    {t("nav.about")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-primary-foreground/80 hover:text-white transition-fast block py-1"
                  >
                    {t("nav.products")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-primary-foreground/80 hover:text-white transition-fast block py-1"
                  >
                    {t("nav.services")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news"
                    className="text-primary-foreground/80 hover:text-white transition-fast block py-1"
                  >
                    {t("nav.news")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/partners"
                    className="text-primary-foreground/80 hover:text-white transition-fast block py-1"
                  >
                    {t("nav.partners")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 md:mb-4">{t("footer.contactUs")}</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base">
                <li className="flex items-center gap-2 text-primary-foreground/80 hover:text-white transition-fast">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href={contact.phone ? `tel:${contact.phone}` : "#"} dir="ltr" className="hover:underline">
                    {contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2 text-primary-foreground/80 hover:text-white transition-fast">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a
                    href={contact.email ? `mailto:${contact.email}` : "#"}
                    dir="ltr"
                    className="hover:underline"
                  >
                    {contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-2 text-primary-foreground/80">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                  <span>{contact.address}</span>
                </li>
              </ul>
              
              {/* Social Media Icons */}
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <a
                  href={social.linkedin || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href={social.facebook || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href={social.twitter || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href={social.tiktok || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                {social.youtube && social.youtube !== "#" && (
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Google Maps */}
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 md:mb-4">{t("footer.location")}</h3>
              <div className="w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden border-2 border-white/20">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3451.143292802676!2d31.28490922!3d30.11871294!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145815e14488a8b7%3A0xbe137de737d70bec!2z2LTYsdmD2Kkg2YXYtdin2YbYuSDYp9mE2K_ZhNiq2Kcg2YTZhNi12YTYqA!5e0!3m2!1sen!2seg!4v1765900285945!5m2!1sen!2seg"                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="موقع مصانع الدلتا للصلب"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-4 sm:pt-6 md:pt-8 text-center">
            <p className="text-xs sm:text-sm text-primary-foreground/80 mb-1.5 sm:mb-2">
              © {new Date().getFullYear()} {siteName}. {t("footer.rightsReserved")}
            </p>
            <p className="text-xs sm:text-sm text-primary-foreground/80">
              {t("footer.designedBy")}{" "}
              <a
                href="https://qeematech.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary-foreground/80 transition-fast underline"
              >
                Qeema Tech
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

