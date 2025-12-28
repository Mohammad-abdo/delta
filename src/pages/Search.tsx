import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, Package, BookOpen, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchAPI } from "@/lib/api";
import { staticLaboratoryEquipment } from "@/data/laboratoryEquipment";
import { staticProducts } from "@/data/products";

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("/uploads/")) return `${apiOrigin}${src}`;
    return src;
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["global-search", q],
    queryFn: async () => {
      try {
        return await searchAPI.search(q);
      } catch (err) {
        console.error("Search API failed, showing static results only:", err);
        return { products: [], services: [], blogPosts: [], pages: [] };
      }
    },
    enabled: q.trim().length > 0,
  });

  useEffect(() => {
    if (q.trim().length > 0) {
      refetch();
    }
  }, [q, refetch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const value = (formData.get("q") as string) || "";
    setParams(value ? { q: value } : {});
  };

  const results = data || { products: [], services: [], blogPosts: [], pages: [] };

  // Local static search (frontend data)
  const searchTerm = q.trim().toLowerCase();
  const staticProductsResults = searchTerm
    ? staticProducts.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(searchTerm) ||
          (p.description || "").toLowerCase().includes(searchTerm) ||
          (p.fullDescription || "").toLowerCase().includes(searchTerm) ||
          (p.category || "").toLowerCase().includes(searchTerm),
      )
    : [];

  const staticLabEquipResults = searchTerm
    ? staticLaboratoryEquipment.filter(
        (e) =>
          (e.name || "").toLowerCase().includes(searchTerm) ||
          (e.description || "").toLowerCase().includes(searchTerm) ||
          (e.model || "").toLowerCase().includes(searchTerm),
      )
    : [];

  const mapPageToRoute = (slug: string) => {
    switch (slug) {
      case "about":
        return "/about";
      case "vision-mission":
        return "/vision-mission";
      case "strategy":
        return "/strategy";
      case "quality":
        return "/quality";
      case "ceo-message":
        return "/ceo-message";
      case "laboratory-equipment":
        return "/services";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-muted/10 to-white py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <SearchIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            البحث في الموقع
          </h1>
          <p className="text-muted-foreground">
            ابحث في المنتجات، الخدمات، والأخبار باستخدام كلمة واحدة أو أكثر
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mb-10 flex gap-3"
          dir="rtl"
        >
          <div className="relative flex-1">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={q}
              placeholder="ابحث عن منتج، خدمة، أو خبر..."
              className="pr-10"
            />
          </div>
          <Button type="submit" className="whitespace-nowrap">
            بحث
          </Button>
        </form>

        {/* Results */}
        {isLoading && q.trim() && (
          <div className="text-center text-muted-foreground py-8">
            جاري البحث...
          </div>
        )}

        {!isLoading && q.trim() && (
          <div className="space-y-8" dir="rtl">
            {/* Backend error notice */}
            {error && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
                تعذر الوصول لنتائج السيرفر حالياً، يتم عرض نتائج الواجهة الثابتة فقط.
              </div>
            )}
            {/* Products */}
            {results.products.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-primary">
                    المنتجات ({results.products.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.products.map((p: any) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="block rounded-xl border border-muted bg-white p-4 hover:border-primary/40 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-primary mb-1">
                        {p.name}
                      </h3>
                      {p.category && (
                        <p className="text-xs text-muted-foreground mb-1">
                          الفئة: {p.category}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Static Products (frontend) */}
            {staticProductsResults.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-primary">
                    منتجات ثابتة (واجهة) ({staticProductsResults.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staticProductsResults.map((p: any) => (
                    <div
                      key={`static-product-${p.id}`}
                      className="block rounded-xl border border-muted bg-white p-4 hover:border-primary/40 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-primary mb-1">
                        {p.name}
                      </h3>
                      {p.category && (
                        <p className="text-xs text-muted-foreground mb-1">
                          الفئة: {p.category}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Services */}
            {results.services.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-primary">
                    الخدمات ({results.services.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.services.map((s: any) => (
                    <Link
                      key={s.id}
                      to={`/service/${s.id}`}
                      className="block rounded-xl border border-muted bg-white p-4 hover:border-primary/40 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-primary mb-1">
                        {s.nameAr || s.name}
                      </h3>
                      {s.category && (
                        <p className="text-xs text-muted-foreground mb-1">
                          الفئة: {s.category.nameAr || s.category.name}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {s.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Blog posts */}
            {results.blogPosts.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-primary">
                    الأخبار والمقالات ({results.blogPosts.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.blogPosts.map((b: any) => (
                    <Link
                      key={b.id}
                      to={`/blog/${b.id}`}
                      className="block rounded-xl border border-muted bg-white p-4 hover:border-primary/40 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-primary mb-1">
                        {b.title}
                      </h3>
                      {b.category && (
                        <p className="text-xs text-muted-foreground mb-1">
                          الفئة: {b.category}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {b.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Static Laboratory Equipment (frontend) */}
            {staticLabEquipResults.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-primary">
                    أجهزة معملية ثابتة (واجهة) ({staticLabEquipResults.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staticLabEquipResults.map((e: any) => (
                    <div
                      key={`static-lab-${e.id}`}
                      className="block rounded-xl border border-muted bg-white p-4 hover:border-primary/40 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-primary mb-1">
                        {e.name}
                      </h3>
                      {e.model && (
                        <p className="text-xs text-muted-foreground mb-1">
                          الموديل: {e.model}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {e.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pages */}
            {results.pages.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <SearchIcon className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-primary">
                    صفحات الموقع ({results.pages.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.pages.map((p: any) => (
                    <Link
                      key={p.id}
                      to={mapPageToRoute(p.slug)}
                      className="block rounded-xl border border-muted bg-white p-4 hover:border-primary/40 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-primary mb-1">
                        {p.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {p.content}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* No results */}
            {results.products.length === 0 &&
              results.services.length === 0 &&
              results.blogPosts.length === 0 &&
              results.pages.length === 0 &&
              staticProductsResults.length === 0 &&
              staticLabEquipResults.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  لا توجد نتائج مطابقة للبحث الحالي.
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;


