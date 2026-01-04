import { Phone, Mail, Linkedin, Facebook, Youtube, Twitter, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { publicSettingsAPI, defaultSettingsData } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
 * Top Header Component
 * 
 * Top information bar displaying contact information and social media links.
 * Appears above the main navigation bar.
 */
const TopHeader = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: settings } = useQuery({
    queryKey: ["public-settings"],
    queryFn: publicSettingsAPI.get,
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry on 404
    refetchOnWindowFocus: false,
  });

  const mergedSettings = settings || defaultSettingsData;
  const contactInfo = mergedSettings.contact || defaultSettingsData.contact;
  const social = mergedSettings.socialMedia || defaultSettingsData.socialMedia;

  const socialLinks = [
    { icon: Linkedin, href: social.linkedin || "#", label: "LinkedIn", isCustom: false },
    { icon: Facebook, href: social.facebook || "#", label: "Facebook", isCustom: false },
    { icon: Twitter, href: social.twitter || "#", label: "Twitter", isCustom: false },
    { icon: TikTokIcon, href: social.tiktok || "#", label: "TikTok", isCustom: true },
  ];

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="fixed top-0 right-0 left-0 z-50 bg-primary text-primary-foreground py-2.5 sm:py-3.5 text-xs sm:text-sm">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-5">
          {/* Contact Information */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 w-full sm:w-auto">
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-1.5 sm:gap-2 hover:text-accent transition-colors text-[11px] sm:text-sm"
              dir="ltr"
            >
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-none">{contactInfo.phone}</span>
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-1.5 sm:gap-2 hover:text-accent transition-colors text-[11px] sm:text-sm hidden sm:flex"
              dir="ltr"
            >
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-none">{contactInfo.email}</span>
            </a>
          </div>

          {/* Desktop Search - centered in top bar (hidden on mobile) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center justify-center flex-1 max-w-xl mx-4"
            dir="rtl"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/80" />
              <Input
                type="text"
                placeholder={t("nav.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 text-xs md:text-sm rounded-full bg-white text-primary placeholder:text-primary/60 border-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </div>
          </form>

          {/* Social Media Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  {social.isCustom ? (
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;

