import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Beaker, Wrench, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { servicesAPI } from "@/lib/api";
import { resolveImageUrl } from "@/lib/imageUtils";

/**
 * Services Page - Dynamic
 * 
 * Displays services organized by categories from the database.
 * Shows simplified cards with image, title, and short description.
 */
const LaboratoryEquipment = () => {
  const { t, i18n } = useTranslation();
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["services", "categories"],
    queryFn: servicesAPI.getCategories,
  });

  const allCategories = Array.isArray(categoriesData) ? categoriesData : [];

  // Filter categories based on language - Only show parent categories (no parentId) in main tabs
  const categories = useMemo(() => {
    return allCategories.filter((category: any) => {
      // Only show categories that don't have a parent (parent categories only)
      if (category.parentId) {
        return false;
      }
      
      // Also filter by language
      if (i18n.language === 'en') {
        // For English: show categories with English name (name field contains English)
        return category.name && category.name.trim() !== '';
      } else {
        // For Arabic: show categories with Arabic name (nameAr field contains Arabic)
        return category.nameAr && category.nameAr.trim() !== '';
      }
    }).map((category: any) => {
      // Also filter services in categories
      const categoryServices = (category.services || []).filter((service: any) => {
        if (i18n.language === 'en') {
          // For English: show services with English name
          return service.name && service.name.trim() !== '';
        } else {
          // For Arabic: show services with Arabic name
          return service.nameAr && service.nameAr.trim() !== '';
        }
      });

      // Filter subcategories
      const categorySubcategories = (category.children || []).filter((sub: any) => {
        if (i18n.language === 'en') {
          // For English: show subcategories with English name
          return sub.name && sub.name.trim() !== '';
        } else {
          // For Arabic: show subcategories with Arabic name
          return sub.nameAr && sub.nameAr.trim() !== '';
        }
      }).map((sub: any) => {
        // Filter services in subcategories
        const subServices = (sub.services || []).filter((service: any) => {
          if (i18n.language === 'en') {
            // For English: show services with English name
            return service.name && service.name.trim() !== '';
          } else {
            // For Arabic: show services with Arabic name
            return service.nameAr && service.nameAr.trim() !== '';
          }
        });
        return { ...sub, services: subServices };
      });

      return { ...category, services: categoryServices, children: categorySubcategories };
    });
  }, [allCategories, i18n.language]);
  
  const resolveImage = resolveImageUrl;

  // Get default tab (first category) - this will be recalculated when categories change
  const defaultTab = useMemo(() => {
    if (categories.length === 0) return "all";
    return categories[0]?.id?.toString() || "all";
  }, [categories]);

  const [activeTab, setActiveTab] = useState(defaultTab);

  // Update active tab when default changes
  useMemo(() => {
    if (defaultTab !== "all" && activeTab === "all") {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, activeTab]);

  // Helper function to truncate description and remove HTML tags
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (!text) return "";
    // Remove HTML tags
    const plainText = text.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + "...";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background via-background to-muted/20 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Beaker className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">{t("services.loading")}</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="min-h-screen py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background via-background to-muted/20" dir="rtl">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-7xl mx-auto text-center py-16">
            <Beaker className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t("services.noServices")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background via-background to-muted/20" dir="rtl">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20 px-2">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-primary/20 to-sky/20 rounded-2xl mb-6 sm:mb-8 shadow-lg">
              <Beaker className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 sm:mb-6 bg-gradient-to-r from-primary to-sky bg-clip-text text-transparent">
              {t("services.title")}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("services.subtitle")}
            </p>
          </div>

          {/* Services Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-row gap-2 w-full mb-12 h-auto p-2 bg-muted/50 rounded-xl border border-muted overflow-x-scroll whitespace-nowrap" style={{ direction: "rtl" }}>
            <div className="flex flex-row gap-2 w-full">

              {categories.map((category: any) => (
                <TabsTrigger
                key={category.id}
                value={category.id.toString()}
                className="text-sm sm:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all whitespace-nowrap w-fit"
                dir="rtl"
                >
                  {category.icon === "wrench" ? (
                    <Wrench className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  ) : (
                    <Beaker className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  )}
                  {i18n.language === "ar" ? (category.nameAr || category.name) : (category.name || category.nameAr)}
                </TabsTrigger>
              ))}
              </div>
            </TabsList>
            {/* Services Content with optional subcategories */}
            {categories.map((category: any) => {
              // Filter services based on language
              const allServices = category.services || [];
              const filteredServices = allServices.filter((service: any) => {
                if (i18n.language === 'en') {
                  // For English: show services with English name
                  return service.name && service.name.trim() !== '';
                } else {
                  // For Arabic: show services with Arabic name
                  return service.nameAr && service.nameAr.trim() !== '';
                }
              });

              // Filter categories based on language
              const allSubcategories = category.children || [];
              const filteredSubcategories = allSubcategories.filter((sub: any) => {
                if (i18n.language === 'en') {
                  // For English: show subcategories with English name
                  return sub.name && sub.name.trim() !== '';
                } else {
                  // For Arabic: show subcategories with Arabic name
                  return sub.nameAr && sub.nameAr.trim() !== '';
                }
              }).map((sub: any) => {
                // Also filter services in subcategories
                const subServices = (sub.services || []).filter((service: any) => {
                  if (i18n.language === 'en') {
                    // For English: show services with English name
                    return service.name && service.name.trim() !== '';
                  } else {
                    // For Arabic: show services with Arabic name
                    return service.nameAr && service.nameAr.trim() !== '';
                  }
                });
                return { ...sub, services: subServices };
              });

              const services = filteredServices;
              const subcategories = filteredSubcategories;
              const hasSub = subcategories.length > 0;

              const renderServiceCard = (service: any, index: number) => (
                <Link
                  key={service.id || index}
                  to={`/service/${service.id}`}
                  className="group"
                >
                  <Card className="h-full overflow-hidden border-2 border-muted/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card/50 backdrop-blur-sm cursor-pointer">
                    {/* Image Section */}
                    <div className="relative h-64 sm:h-72 overflow-hidden bg-white">
                      {service.imageUrl ? (
                      <img
                        src={resolveImage(service.imageUrl)}
                        alt={i18n.language === "ar" ? (service.nameAr || service.name) : (service.name || service.nameAr)}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Beaker className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <ArrowLeft className="w-6 h-6 text-white mb-2" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-6 space-y-3 text-right" dir="rtl">
                      <h3 className="text-xl sm:text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors line-clamp-2">
                        {i18n.language === "ar" ? (service.nameAr || service.name) : (service.name || service.nameAr)}
                      </h3>
                      <p className="text-sm sm:text-base text-foreground/70 leading-relaxed line-clamp-3">
                        {truncateDescription(i18n.language === "ar" ? (service.description || "") : (service.descriptionEn || service.description || ""), 120)}
                      </p>
                      <div className="flex flex-row-reverse items-center gap-2 text-primary text-sm font-medium pt-2 justify-start">
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t("services.readMore")}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );

              return (
                <TabsContent key={category.id} value={category.id.toString()} className="mt-8">
                  {hasSub ? (
                    <Tabs defaultValue={subcategories[0]?.id?.toString()} className="w-full">
                      <TabsList className="flex flex-row gap-2 w-full mb-6 h-auto p-2 bg-muted/40 rounded-lg border border-muted overflow-x-auto whitespace-nowrap" style={{ direction: "rtl" }}>
                      <div className="flex flex-row gap-2 w-full"> 
                        {subcategories.map((sub: any) => (
                          <TabsTrigger
                            key={sub.id}
                            value={sub.id.toString()}
                            className="text-sm sm:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all whitespace-nowrap"
                          >
                            {i18n.language === "ar" ? (sub.nameAr || sub.name) : (sub.name || sub.nameAr)}
                          </TabsTrigger>
                        ))}
                      </div>
                      </TabsList>
                      {subcategories.map((sub: any) => (
                        <TabsContent key={sub.id} value={sub.id.toString()}>
                          {sub.services && sub.services.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8" dir="rtl">
                              {sub.services.map((service: any, idx: number) => renderServiceCard(service, idx))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">{t("services.noServicesInSubcategory")}</div>
                          )}
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8" dir="rtl">
                      {services.map((service: any, index: number) => renderServiceCard(service, index))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Beaker className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg">{t("services.noServicesInCategory")}</p>
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryEquipment;
