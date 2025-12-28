import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Play, X } from "lucide-react";
import { heroAPI } from "@/lib/api";
import heroImage from "@/assets/hero1.webp";
import steelProducts from "@/assets/hero4.webp";
import qualityControl from "@/assets/hero3.webp";
import videoThumbnail1 from "@/assets/115.webp";
import videoThumbnail2 from "@/assets/120.webp";

// Videos are in public folder with English names to avoid issues
const documentaryVideo = "/videos/documentary-video.mp4";
// Re-encoded video with proper format
const laboratoryVideo = "/videos/New-Video.mp4";

type SlideType = {
  id: number;
  type: "image" | "video";
  src: string;
  poster?: string;
};

/**
 * Simplified Hero Section with Image/Video Slider
 * 
 * Displays a carousel of images and videos only, without text content.
 */
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [lightboxVideoSrc, setLightboxVideoSrc] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Load hero slides from admin settings
  const { data: heroData } = useQuery({
    queryKey: ["hero-public"],
    queryFn: heroAPI.get,
    staleTime: 5 * 60 * 1000,
  });

  // Default static slides (fallback)
  // Order: image - video - image - video - image
  const defaultSlides: SlideType[] = [
    {
      id: 1,
      type: "image",
      src: heroImage,
    },
    {
      id: 2,
      type: "video",
      src: documentaryVideo,
      poster: videoThumbnail1,
    },
    {
      id: 3,
      type: "image",
      src: steelProducts,
    },
    {
      id: 4,
      type: "video",
      src: laboratoryVideo,
      poster: videoThumbnail2,
    },
    {
      id: 5,
      type: "image",
      src: qualityControl,
    },
  ];

  // Map admin hero slides (images only for now)
  const adminSlides: SlideType[] =
    Array.isArray((heroData as any)?.slides) && (heroData as any).slides.length
      ? (heroData as any).slides
          .filter((s: any) => s?.image)
          .map((s: any, idx: number) => ({
            id: s.id || idx + 1,
            type: "image" as const,
            src: s.image,
          }))
      : [];

  // If admin defined slides, use them. Otherwise use default.
  const slides: SlideType[] = adminSlides.length ? adminSlides : defaultSlides;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
    setCurrentSlide(safeIndex);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const openLightbox = (slide: SlideType) => {
    if (slide.type !== "video") return;
    // Ensure the video path is correct
    let videoSrc = slide.src;
    if (!videoSrc.startsWith('/')) {
      videoSrc = `/${videoSrc}`;
    }
    // Remove any double slashes
    videoSrc = videoSrc.replace(/\/+/g, '/');
    console.log("Opening video:", videoSrc);
    setLightboxVideoSrc(videoSrc);
    setIsAutoPlaying(false);
  };

  const closeLightbox = () => {
    setLightboxVideoSrc(null);
    setVideoError(null);
    setIsAutoPlaying(true);
  };

  const safeCurrentSlide = Math.max(0, Math.min(currentSlide, slides.length - 1));
  const currentSlideData = slides[safeCurrentSlide] || slides[0];

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden pt-20 sm:pt-24 md:pt-28"
      style={{ 
        height: isMobile ? '100vh' : '110vh',
        minHeight: isMobile ? '100vh' : '110vh',
        marginTop: '0'
      }}
    >
      {/* Slides Container */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {slide.type === "video" ? (
              <button
                type="button"
                onClick={() => openLightbox(slide)}
                className="relative w-full h-full cursor-pointer group"
              >
                <img
                  src={slide.poster || slide.src}
                  alt="Video slide"
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/80 group-hover:bg-white shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </div>
                </div>
              </button>
            ) : (
              <>
                <img
                  src={slide.src}
                  alt={`Slide ${slide.id}`}
                  className="w-full h-full object-cover"
                />
                {/* Subtle overlay for better visibility */}
                <div className="absolute inset-0 bg-black/10" />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 group"
        aria-label="Previous slide"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 hover:bg-white/30 hover:border-white/60 transition-all duration-300 flex items-center justify-center group-hover:scale-110 shadow-xl">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white group-hover:-translate-x-1 transition-transform" />
        </div>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 group"
        aria-label="Next slide"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 hover:bg-white/30 hover:border-white/60 transition-all duration-300 flex items-center justify-center group-hover:scale-110 shadow-xl">
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white group-hover:translate-x-1 transition-transform" />
        </div>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-24 sm:bottom-32 md:bottom-48 lg:bottom-52 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-8 sm:w-10 bg-white shadow-lg"
                : "w-2 sm:w-3 bg-white/40 hover:bg-white/60 hover:w-4 sm:hover:w-6"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Lightbox Video Modal */}
      {lightboxVideoSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-primary transition-colors z-10"
            aria-label="إغلاق الفيديو"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <div className="w-full max-w-4xl">
            {videoError ? (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center border border-white/20">
                <p className="text-white text-lg mb-4">عذراً، لا يمكن تشغيل هذا الفيديو</p>
                <p className="text-white/80 text-sm mb-6">
                  تنسيق الفيديو غير مدعوم. يرجى إعادة ترميز الفيديو بتنسيق H.264 + AAC
                </p>
                <button
                  onClick={closeLightbox}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            ) : (
              <video
                key={lightboxVideoSrc} // Force re-render when video changes
                src={lightboxVideoSrc}
                controls
                autoPlay
                preload="metadata"
                playsInline
                className="w-full h-auto rounded-xl shadow-2xl border border-white/20"
                onError={(e) => {
                  console.error("Video error:", e);
                  console.error("Video src:", lightboxVideoSrc);
                  const target = e.target as HTMLVideoElement;
                  if (target.error) {
                    console.error("Video error code:", target.error.code);
                    console.error("Video error message:", target.error.message);
                    // If it's a format error (code 4), show error message
                    if (target.error.code === 4) {
                      setVideoError("Video format not supported");
                    }
                  }
                }}
                onLoadStart={() => {
                  console.log("Video loading started:", lightboxVideoSrc);
                  setVideoError(null);
                }}
                onCanPlay={() => {
                  console.log("Video can play:", lightboxVideoSrc);
                  setVideoError(null);
                }}
              />
            )}
          </div>
        </div>
      )}

    </section>
  );
};

export default HeroSection;
