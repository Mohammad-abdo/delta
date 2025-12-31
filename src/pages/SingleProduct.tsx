import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Package, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productsAPI } from "@/lib/api";

/**
 * Single Product Page
 * 
 * Displays detailed information about a single product.
 * 
 * @returns JSX element containing single product page
 */
const SingleProduct = () => {
  const { id } = useParams<{ id: string }>();
  
  // Debug: Log product ID
  useEffect(() => {
    console.log('SingleProduct - Product ID from URL:', id);
    console.log('SingleProduct - Product ID as Number:', Number(id));
  }, [id]);
  
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("/uploads/")) return `${apiOrigin}${src}`;
    return src;
  };

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        const data = await productsAPI.getById(Number(id));
        
        // Log for debugging
        if (data) {
          console.log('=== Product Data from API ===');
          console.log('ID:', data.id);
          console.log('Name:', data.name);
          console.log('Has imageUrl:', !!data.imageUrl);
          console.log('imageUrl type:', typeof data.imageUrl);
          console.log('imageUrl length:', data.imageUrl?.length || 0);
          
          if (data.imageUrl) {
            console.log('imageUrl starts with:', data.imageUrl.substring(0, 60));
            console.log('Is base64:', data.imageUrl.startsWith('data:image/'));
          }
          
          console.log('============================');
        } else {
          console.error('Product not found - data is null');
        }
        
        return data;
      } catch (err: any) {
        console.error('Error fetching product:', err);
        if (err.status === 404) {
          throw new Error('المنتج غير موجود');
        }
        throw err;
      }
    },
    enabled: Boolean(id),
    retry: 1,
  });

  // Update image source when product changes
  useEffect(() => {
    if (product) {
      const src = resolveImage(product.imageUrl || product.image);
      if (src && src.trim()) {
        // Clean and validate base64 image
        let cleanSrc = src.trim();
        
        // Ensure proper base64 format
        if (cleanSrc.startsWith('data:image/')) {
          // Extract and validate base64 part
          const match = cleanSrc.match(/^data:image\/([^;]+);base64,(.+)$/);
          if (match) {
            const imageType = match[1];
            const base64Data = match[2];
            
            // Remove any whitespace from base64 data
            const cleanBase64 = base64Data.replace(/\s/g, '');
            
            // Reconstruct the data URL
            cleanSrc = `data:image/${imageType};base64,${cleanBase64}`;
            
            console.log('Cleaned image source, length:', cleanSrc.length);
            
            // Try to create blob URL as fallback
            try {
              // Convert base64 to blob
              const byteCharacters = atob(cleanBase64);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: `image/${imageType}` });
              
              // Clean up old blob URL
              if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
              }
              
              // Create new blob URL
              const url = URL.createObjectURL(blob);
              blobUrlRef.current = url;
              setBlobUrl(url);
              
              console.log('Created blob URL as fallback');
            } catch (error) {
              console.warn('Failed to create blob URL:', error);
            }
          }
        }
        
        setImageSrc(cleanSrc);
        setImageError(false);
      } else {
        setImageSrc(null);
        setBlobUrl(null);
      }
    }
    
    // Cleanup blob URL on unmount
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-primary mb-2">جاري تحميل المنتج...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-4">خطأ في تحميل المنتج</h1>
          <p className="text-muted-foreground mb-4">{String(error)}</p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link to="/products">العودة إلى المنتجات</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">الصفحة الرئيسية</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-4">المنتج غير موجود</h1>
          <p className="text-muted-foreground mb-4">المنتج الذي تبحث عنه غير موجود أو تم حذفه</p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link to="/products">العودة إلى المنتجات</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">الصفحة الرئيسية</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-muted/10 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button asChild variant="ghost">
              <Link to="/" className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                العودة إلى الصفحة الرئيسية
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image & Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-muted">
                {imageSrc && !imageError ? (
                  <div className="relative w-full">
                    {/* Try data URL first, fallback to blob URL */}
                  <img
                      key={`img-${product.id}`}
                      src={blobUrl || imageSrc}
                    alt={product.name}
                      className="w-full h-auto object-contain max-h-96 mx-auto"
                      crossOrigin="anonymous"
                      decoding="async"
                      loading="lazy"
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        console.log('✓ Image loaded successfully');
                        console.log('Using:', blobUrl ? 'blob URL' : 'data URL');
                        console.log('Image natural dimensions:', img.naturalWidth, 'x', img.naturalHeight);
                        setImageError(false);
                      }}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        console.error('✗ Image failed to load');
                        console.error('Tried:', blobUrl ? 'blob URL' : 'data URL');
                        console.error('Image source length:', imageSrc.length);
                        
                        // Check if image is too small (might be corrupted)
                        if (imageSrc.length < 200) {
                          console.warn('⚠️ Image is very small, might be corrupted or incomplete');
                        }
                        
                        // Try blob URL if data URL failed and we have blob URL
                        if (blobUrl && img.src === imageSrc) {
                          console.log('Retrying with blob URL...');
                          // Force re-render with blob URL
                          setTimeout(() => {
                            const newImg = document.querySelector(`img[alt="${product.name}"]`) as HTMLImageElement;
                            if (newImg && newImg.src !== blobUrl) {
                              newImg.src = blobUrl;
                            }
                          }, 100);
                        } else {
                          console.error('Image source preview:', imageSrc.substring(0, 100));
                          console.error('Image element:', {
                            src: img.src.substring(0, 100),
                            complete: img.complete,
                            naturalWidth: img.naturalWidth,
                            naturalHeight: img.naturalHeight,
                          });
                          setImageError(true);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-muted flex flex-col items-center justify-center text-muted-foreground p-4">
                    <Package className="w-16 h-16 mb-2 opacity-50" />
                    <p>لا توجد صورة متاحة</p>
                    {imageSrc && (
                      <>
                        <p className="text-xs mt-2">طول البيانات: {imageSrc.length} حرف</p>
                        <p className="text-xs mt-1">نوع الصورة: {imageSrc.startsWith('data:image/') ? 'base64' : 'URL'}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Gallery */}
              {(() => {
                const gallery = Array.isArray(product.gallery) 
                  ? product.gallery 
                  : typeof product.gallery === 'string'
                    ? (() => {
                        try {
                          const parsed = JSON.parse(product.gallery);
                          return Array.isArray(parsed) ? parsed : [];
                        } catch {
                          return [];
                        }
                      })()
                    : [];
                
                return gallery.length > 0 ? (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-muted">
                    <h3 className="text-xl font-bold text-primary mb-4">معرض الصور</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {gallery.map((img: string, index: number) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden border border-muted hover:border-primary transition-colors cursor-pointer group"
                        >
                          <img
                            src={img}
                            alt={`${product.name} - صورة ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-6 h-6 text-primary" />
                  <span className="text-sm text-muted-foreground">منتجنا</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Specifications */}
              {(() => {
                const specs = Array.isArray(product.specifications)
                  ? product.specifications
                  : typeof product.specifications === 'string'
                    ? (() => {
                        try {
                          const parsed = JSON.parse(product.specifications);
                          return Array.isArray(parsed) ? parsed : [product.specifications];
                        } catch {
                          return product.specifications.split('\n').filter((line: string) => line.trim());
                        }
                      })()
                    : [];
                
                return specs.length > 0 ? (
              <div className="bg-white rounded-xl p-6 shadow-md border border-muted">
                <h2 className="text-2xl font-bold text-primary mb-4">المواصفات</h2>
                <ul className="space-y-3">
                      {specs.map((spec: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
                ) : null;
              })()}

              {/* Applications */}
              {(() => {
                const apps = Array.isArray(product.applications)
                  ? product.applications
                  : typeof product.applications === 'string'
                    ? (() => {
                        try {
                          const parsed = JSON.parse(product.applications);
                          return Array.isArray(parsed) ? parsed : [product.applications];
                        } catch {
                          return product.applications.split('\n').filter((line: string) => line.trim());
                        }
                      })()
                    : [];
                
                return apps.length > 0 ? (
              <div className="bg-white rounded-xl p-6 shadow-md border border-muted">
                <h2 className="text-2xl font-bold text-primary mb-4">مجالات التطبيق</h2>
                <ul className="space-y-3">
                      {apps.map((app: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-sky mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
                ) : null;
              })()}

              {/* Contact Button */}
              <Button asChild size="lg" className="w-full bg-gradient-to-r from-primary to-sky">
                <Link to="/contact">تواصل معنا للاستفسار</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;


