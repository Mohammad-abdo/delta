import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Beaker, Wrench, CheckCircle2, Sparkles, X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { servicesAPI } from "@/lib/api";
import { resolveImageUrl } from "@/lib/imageUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import "@/styles/rich-text.css";

/**
 * Service Details Page
 * 
 * Displays detailed information about a single service including
 * image, description, capabilities, equipment, and gallery.
 */
const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const resolveImage = resolveImageUrl;

  const { data: service, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: () => servicesAPI.getService(Number(id)),
    enabled: Boolean(id),
  });

  const parseJsonField = (field: any): any[] => {
    if (Array.isArray(field)) return field;
    if (field === null || field === undefined) return [];
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const handleImageClick = (imageUrl: string, gallery?: string[]) => {
    if (gallery && gallery.length > 0) {
      setSelectedGallery(gallery);
      const index = gallery.findIndex((img) => img === imageUrl);
      setGalleryIndex(index >= 0 ? index : 0);
    } else {
      setSelectedGallery([imageUrl]);
      setGalleryIndex(0);
    }
    setSelectedImage(imageUrl);
  };

  const handlePrevImage = () => {
    if (selectedGallery.length > 0) {
      const newIndex = galleryIndex > 0 ? galleryIndex - 1 : selectedGallery.length - 1;
      setGalleryIndex(newIndex);
      setSelectedImage(selectedGallery[newIndex]);
    }
  };

  const handleNextImage = () => {
    if (selectedGallery.length > 0) {
      const newIndex = galleryIndex < selectedGallery.length - 1 ? galleryIndex + 1 : 0;
      setGalleryIndex(newIndex);
      setSelectedImage(selectedGallery[newIndex]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/20" dir="rtl">
        <div className="text-center">
          <Beaker className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">جاري تحميل الخدمة...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/20" dir="rtl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">الخدمة غير موجودة</h1>
          <Button asChild>
            <Link to="/services">العودة إلى الخدمات</Link>
          </Button>
        </div>
      </div>
    );
  }

  const capabilities = parseJsonField(service.capabilities);
  const equipment = parseJsonField(service.equipment);
  const gallery = parseJsonField(service.gallery).map((g) => resolveImage(g));
  const mainImage = resolveImage(service.imageUrl);
  const allImages = mainImage 
    ? [mainImage, ...gallery]
    : gallery;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-8 sm:py-12 md:py-16 lg:py-24" dir="rtl">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Button asChild variant="ghost" className="group">
                <Link to="/services" className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  العودة إلى الخدمات
                </Link>
              </Button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Section */}
              <div className="space-y-4">
                {/* Main Image */}
                {mainImage && (
                  <div 
                    className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-xl cursor-pointer group"
                    onClick={() => handleImageClick(mainImage, allImages)}
                  >
                    <img
                      src={mainImage}
                      alt={service.nameAr || service.name}
                      className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-300 group-hover:scale-105"
                    />
                    {allImages.length > 1 && (
                      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm">
                        <ImageIcon className="w-4 h-4" />
                        {allImages.length} صورة
                      </div>
                    )}
                  </div>
                )}

                {/* Gallery Thumbnails */}
                {gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {gallery.slice(0, 4).map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative aspect-square overflow-hidden rounded-lg cursor-pointer border-2 border-muted hover:border-primary transition-colors group"
                        onClick={() => handleImageClick(img, allImages)}
                      >
                        <img
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ))}
                    {gallery.length > 4 && (
                      <div 
                        className="relative aspect-square overflow-hidden rounded-lg border-2 border-muted bg-muted/50 flex items-center justify-center cursor-pointer hover:border-primary transition-colors group"
                        onClick={() => handleImageClick(gallery[4], allImages)}
                      >
                        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                          +{gallery.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="space-y-6">
                {/* Category Badge */}
                {service.category && (
                  <div className="flex items-center gap-2 mb-4">
                    {service.category.icon === "wrench" ? (
                      <Wrench className="w-5 h-5 text-sky" />
                    ) : (
                      <Beaker className="w-5 h-5 text-primary" />
                    )}
                    <span className="bg-primary/10 text-primary text-sm font-bold px-4 py-2 rounded-full">
                      {service.category.nameAr || service.category.name}
                    </span>
                  </div>
                )}

                {/* Service Name */}
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
                    {i18n.language === "ar" ? (service.nameAr || service.name) : (service.nameEn || service.name || service.nameAr)}
                  </h1>
                  <div 
                    className="rich-text-content text-lg text-foreground/80 leading-relaxed"
                    style={{ 
                      direction: i18n.language === "ar" ? "rtl" : "ltr",
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: i18n.language === "ar" 
                        ? (service.description || "") 
                        : (service.descriptionEn || service.description || "") 
                    }}
                  />
                </div>

                {/* Capabilities */}
                {capabilities.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-md border border-muted">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold text-primary">القدرات والخدمات</h2>
                    </div>
                    <ul className="space-y-3">
                      {capabilities.map((capability: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground leading-relaxed">{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Equipment */}
                {equipment.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-md border border-muted">
                    <h2 className="text-2xl font-bold text-primary mb-4">المعدات</h2>
                    <div className="flex flex-wrap gap-2">
                      {equipment.map((equip: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-sm bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20"
                        >
                          {equip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl w-full p-0">
          <DialogDescription className="sr-only">معرض الصور - عرض صورة الخدمة</DialogDescription>
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage}
                alt="Gallery"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              {selectedGallery.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-50"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-50"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
                    {galleryIndex + 1} / {selectedGallery.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceDetails;

