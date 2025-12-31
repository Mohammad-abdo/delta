import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { productsAPI } from "@/lib/api";

/**
 * ProductsSection Component
 * 
 * Displays a section showcasing company products with images and names.
 * Includes scroll animations for better user experience.
 * 
 * @returns JSX element containing products section
 */
const ProductsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          entry.target.classList.remove("opacity-0");
        }
      });
    }, observerOptions);

    if (sectionRef.current) {
      sectionRef.current.classList.add("opacity-0", "transition-opacity", "duration-700");
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", "home"],
    queryFn: productsAPI.getAllPublic, // Use public endpoint
  });

  const products = Array.isArray(productsData) ? productsData : [];

  return (
    <section
      ref={sectionRef}
      className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-b from-white via-muted/10 to-white"
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12 px-2">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-primary/10 rounded-full mb-2 sm:mb-3 md:mb-4">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2 sm:mb-3 md:mb-4">
              منتجاتنا
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
              نقدم مجموعة واسعة من منتجات الحديد والصلب عالية الجودة التي تلبي
              احتياجات مختلف القطاعات الصناعية
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">جاري تحميل المنتجات...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لا توجد منتجات متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {products.map((product: any, index: number) => {
              // Creative color schemes for each card
              const cardThemes = [
                { 
                  gradient: "from-primary via-primary/90 to-primary/80",
                  bg: "bg-primary",
                  text: "text-white",
                  accent: "bg-white/20",
                  border: "border-primary/30",
                },
                { 
                  gradient: "from-sky via-sky/90 to-sky/80",
                  bg: "bg-sky",
                  text: "text-white",
                  accent: "bg-white/20",
                  border: "border-sky/30",
                },
                { 
                  gradient: "from-secondary via-secondary/90 to-secondary/80",
                  bg: "bg-secondary",
                  text: "text-white",
                  accent: "bg-white/20",
                  border: "border-secondary/30",
                },
                { 
                  gradient: "from-primary/90 via-primary to-primary/90",
                  bg: "bg-primary",
                  text: "text-white",
                  accent: "bg-white/20",
                  border: "border-primary/30",
                },
                { 
                  gradient: "from-sky/90 via-sky to-sky/90",
                  bg: "bg-sky",
                  text: "text-white",
                  accent: "bg-white/20",
                  border: "border-sky/30",
                },
                { 
                  gradient: "from-secondary/90 via-secondary to-secondary/90",
                  bg: "bg-secondary",
                  text: "text-white",
                  accent: "bg-white/20",
                  border: "border-secondary/30",
                },
              ];
              
              const theme = cardThemes[index % cardThemes.length];

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group relative block h-full"
                >
                  <div className={`relative h-full rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 ${theme.border} bg-gradient-to-br ${theme.gradient}`}>
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div 
                        className="absolute inset-0" 
                        style={{
                          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                          backgroundSize: '32px 32px'
                        }} 
                      />
                    </div>

                    {/* Top Accent Circle */}
                    <div className={`absolute -top-12 -right-12 w-32 h-32 ${theme.accent} rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />

                    {/* Content */}
                    <div className="relative z-10 p-3 sm:p-4 md:p-6 flex flex-col h-full">
                      {/* Product Image Container */}
                      <div className="relative mb-3 sm:mb-4 md:mb-6 flex-shrink-0">
                        <div className="relative h-40 sm:h-48 md:h-56 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-white/20">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                          <div className="relative h-full flex items-center justify-center p-3 sm:p-4 md:p-6">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-lg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col">
                        {/* Product Name */}
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${theme.text} mb-1.5 sm:mb-2 md:mb-3 group-hover:scale-105 transition-transform duration-300`}>
                          {product.name}
                        </h3>
                        
                        {/* Description */}
                        <p className={`${theme.text}/90 leading-relaxed text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6 flex-1`}>
                          {product.description}
                        </p>

                        {/* Bottom Badge */}
                        <div className="flex items-center justify-between pt-2 sm:pt-3 md:pt-4 border-t border-white/20">
                          <span className={`text-xs sm:text-sm ${theme.text}/80 font-medium`}>
                            منتج مميز
                          </span>
                          <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full ${theme.accent} group-hover:scale-125 transition-transform duration-300`} />
                        </div>
                      </div>
                    </div>

                    {/* Hover Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-3xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Corner Decoration */}
                    <div className={`absolute top-0 right-0 w-16 h-16 ${theme.accent} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  </div>
                </Link>
              );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;

