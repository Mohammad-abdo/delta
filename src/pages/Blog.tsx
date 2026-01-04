import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, Calendar, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { blogAPI } from "@/lib/api";
import { resolveImageUrl } from "@/lib/imageUtils";

/**
 * News Page (formerly Blog)
 * 
 * Displays all news posts with filtering and search functionality.
 * 
 * @returns JSX element containing news page
 */
const Blog = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const resolveImage = resolveImageUrl;

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["publicBlogPosts"],
    queryFn: blogAPI.listPublished,
    refetchOnWindowFocus: true,
  });

  // Filter posts based on language
  const posts = useMemo(() => {
    const allPosts = Array.isArray(postsData) ? postsData : [];
    if (i18n.language === 'en') {
      // For English: show only posts with English content (titleEn)
      return allPosts.filter((post: { titleEn?: string; title?: string }) => post.titleEn && post.titleEn.trim() !== '');
    } else {
      // For Arabic: show only posts with Arabic content (title)
      return allPosts.filter((post: { title?: string }) => post.title && post.title.trim() !== '');
    }
  }, [postsData, i18n.language]);

  const categories = useMemo(() => {
    const found = new Set<string>();
    posts.forEach((p: { category?: string }) => {
      if (p.category) found.add(p.category);
    });
    return ["all", ...Array.from(found)];
  }, [posts]);

  const filteredPosts = posts.filter((post: { titleEn?: string; title?: string; excerptEn?: string; excerpt?: string; category?: string }) => {
    const titleToSearch = i18n.language === 'en' ? (post.titleEn || post.title || '') : (post.title || '');
    const excerptToSearch = i18n.language === 'en' ? (post.excerptEn || post.excerpt || '') : (post.excerpt || '');
    const matchesSearch =
      titleToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerptToSearch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-muted/10 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-sky/20 rounded-full mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              {t("blog.title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("blog.subtitle")}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4 md:flex md:items-center md:justify-between md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("blog.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm"
                >
                  {category === "all" ? t("nav.all") : category}
                </Button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="text-center py-12">{t("blog.loading")}</div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post: { id: number; date?: string; image?: string; titleEn?: string; title?: string; excerptEn?: string; excerpt?: string; category?: string }) => {
                const formattedDate = post.date
                  ? new Date(post.date).toLocaleDateString(i18n.language === 'en' ? "en-US" : "ar-EG")
                  : "";
                return (
                  <article
                    key={post.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-muted hover:border-primary/20"
                  >
                    {/* Post Image */}
                    <Link to={`/blog/${post.id}`}>
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-sky/10">
                        {post.image ? (
                          <img
                            src={resolveImage(post.image)}
                            alt={i18n.language === 'en' && post.titleEn ? post.titleEn : (post.title || '')}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                const placeholder = parent.querySelector('.image-placeholder') as HTMLElement;
                                if (placeholder) placeholder.style.display = 'flex';
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center image-placeholder">
                            <BookOpen className="w-16 h-16 text-primary/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Category Badge */}
                        {post.category && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              {post.category}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Post Content */}
                    <div className="p-6">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{formattedDate}</span>
                      </div>

                      {/* Title */}
                      <Link to={`/blog/${post.id}`}>
                        <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary/80 transition-colors line-clamp-2">
                          {i18n.language === 'en' ? (post.titleEn || post.title || '') : (post.title || '')}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {i18n.language === 'en' ? (post.excerptEn || post.excerpt || '') : (post.excerpt || '')}
                      </p>

                      {/* Read More Button */}
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-between group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                      >
                        <Link to={`/blog/${post.id}`}>
                          <span>{t("blog.readMore")}</span>
                          <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>

                    {/* Hover Effect Line */}
                    <div className="h-1 w-0 bg-gradient-to-r from-primary via-sky to-primary group-hover:w-full transition-all duration-700" />
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t("blog.noPosts")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;

