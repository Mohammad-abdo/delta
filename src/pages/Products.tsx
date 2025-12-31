import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { productsAPI } from "@/lib/api";
import { useTranslation } from "react-i18next";

/**
 * Products Page with Category Tabs
 * 
 * Displays products organized by categories using tabs.
 * First category is open by default.
 */
const Products = () => {
  const { t, i18n } = useTranslation();
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ["products", "public"],
    queryFn: productsAPI.getAllPublic, // Use public endpoint
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("/uploads/")) return `${apiOrigin}${src}`;
    return src;
  };

  const allProducts: any[] = Array.isArray(productsData) ? productsData : [];

  // Filter products based on language
  const filteredProducts = useMemo(() => {
    if (i18n.language === 'en') {
      // For English: show products with English content, or fallback to Arabic if no English
      return allProducts.filter((product: any) => 
        (product.nameEn && product.nameEn.trim() !== '') || 
        (product.name && product.name.trim() !== '')
      );
    } else {
      // For Arabic: show products with Arabic content
      return allProducts.filter((product: any) => product.name && product.name.trim() !== '');
    }
  }, [allProducts, i18n.language]);

  const categories = useMemo(
    () => {
      const cats = Array.from(new Set(filteredProducts.map((p: any) => {
        // Use appropriate category based on language
        if (i18n.language === 'en' && p.categoryEn) {
          return p.categoryEn;
        }
        return p.category;
      }).filter(Boolean))) as string[];
      
      // Debug: Log categories
      console.log("Categories found:", cats.length, cats);
      return cats;
    },
    [filteredProducts, i18n.language],
  );

  // Get products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    filteredProducts.forEach((product: any) => {
      const category = (i18n.language === 'en' && product.categoryEn) 
        ? product.categoryEn 
        : (product.category || t("products.unclassified"));
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  }, [filteredProducts, t, i18n.language]);

  // Default to first category or "all"
  const defaultCategory = categories.length > 0 ? categories[0] : "all";

  // Debug: Log products data
  useEffect(() => {
    if (productsData) {
      console.log("Products data received:", productsData.length, "products");
      console.log("Filtered products:", filteredProducts.length);
      console.log("Categories:", categories.length);
    }
  }, [productsData, filteredProducts, categories]);

  return (
    <div className="min-h-screen relative">
      {/* Subtle Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {t("products.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("products.subtitle")}
          </p>
        </div>

        {/* Products by Category Tabs */}
        {isLoading ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t("products.loading")}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-red-500 text-lg">خطأ في تحميل المنتجات</p>
            <p className="text-muted-foreground text-sm mt-2">{String(error)}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t("products.noProducts")}</p>
            {allProducts.length > 0 && (
              <p className="text-muted-foreground text-sm mt-2">
                تم العثور على {allProducts.length} منتج لكن لا يوجد منتجات متطابقة مع اللغة المحددة
              </p>
            )}
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <div className="mb-8" style={{ direction: 'rtl' }}>
              <TabsList className="flex flex-row flex-wrap gap-2 h-auto p-2 bg-muted/50 rounded-lg w-auto mr-0 ml-auto">
                <TabsTrigger value="all" className="text-sm sm:text-base flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {filteredProducts.length}
                  </Badge>
                  {t("nav.all")}
                </TabsTrigger>
                {categories.length > 0 && categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="text-sm sm:text-base flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {productsByCategory[category]?.length || 0}
                    </Badge>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* All Products Tab */}
            <TabsContent value="all" className="mt-6" dir="rtl">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">{t("products.noProducts")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" style={{ direction: 'rtl' }}>
                  {filteredProducts.map((product: any, index: number) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Category Tabs */}
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-6" dir="rtl">
                {productsByCategory[category]?.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">{t("products.noProductsInCategory")}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" style={{ direction: 'rtl' }}>
                    {productsByCategory[category]?.map((product: any, index: number) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, index }: { product: any; index: number }) => {
  const { t, i18n } = useTranslation();
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("/uploads/")) return `${apiOrigin}${src}`;
    return src;
  };

  const cardThemes = [
    { gradient: "from-primary via-primary/90 to-primary/80", bg: "bg-primary", text: "text-white", accent: "bg-white/20", border: "border-primary/30" },
    { gradient: "from-sky via-sky/90 to-sky/80", bg: "bg-sky", text: "text-white", accent: "bg-white/20", border: "border-sky/30" },
    { gradient: "from-secondary via-secondary/90 to-secondary/80", bg: "bg-secondary", text: "text-white", accent: "bg-white/20", border: "border-secondary/30" },
    { gradient: "from-primary/90 via-primary to-primary/90", bg: "bg-primary", text: "text-white", accent: "bg-white/20", border: "border-primary/30" },
  ];
  
  const theme = cardThemes[index % cardThemes.length];

  return (
    <div className="group relative block h-full">
      <div className={`relative h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 ${theme.border} bg-gradient-to-br ${theme.gradient}`}>
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} 
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 md:p-6 flex flex-col h-full">
          {/* Product Image */}
          <div className="relative mb-4 flex-shrink-0">
            <div className="relative h-40 md:h-48 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <div className="relative h-full flex items-center justify-center p-4">
                {(() => {
                  const imageSrc = resolveImage(product.imageUrl || product.image);
                  
                  if (imageSrc && imageSrc.trim()) {
                    const isBase64 = imageSrc.startsWith('data:image/');
                    const isHttpUrl = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');
                    const isRelativePath = imageSrc.startsWith('/');
                    
                    if (isBase64 || isHttpUrl || isRelativePath) {
                      return (
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>';
                            }
                          }}
                        />
                      );
                    }
                  }
                  
                  return <Package className="w-16 h-16 text-white/50" />;
                })()}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col">
            {/* Category Badge */}
            {((i18n.language === 'en' && product.categoryEn) || product.category) && (
              <Badge variant="secondary" className="mb-2 w-fit">
                {i18n.language === 'en' && product.categoryEn ? product.categoryEn : product.category}
              </Badge>
            )}

            {/* Product Name */}
            <Link to={`/product/${product.id}`}>
              <h3 className={`text-lg md:text-xl font-bold ${theme.text} mb-2 group-hover:scale-105 transition-transform duration-300`}>
                {i18n.language === 'en' && product.nameEn ? product.nameEn : product.name}
              </h3>
            </Link>
            
            {/* Description */}
            <p className={`${theme.text}/90 text-sm mb-4 flex-1 line-clamp-2`}>
              {i18n.language === 'en' && product.descriptionEn ? product.descriptionEn : product.description}
            </p>

            {/* CTA and Stock */}
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-white text-primary text-xs md:text-sm font-semibold shadow-sm hover:bg-primary hover:text-white transition-colors"
              >
                {t("products.orderNow")}
              </Link>
              {product.inStock !== false && (
                <Badge className="bg-green-500/20 text-green-100 border-green-500/30">
                  {t("common.inStock")}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
};

export default Products;
