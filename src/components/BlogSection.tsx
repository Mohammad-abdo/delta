import { useRef, useEffect } from "react";
import { BookOpen, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { blogPostsData } from "@/data/content";

/**
 * BlogSection Component
 * 
 * Displays a blog section showcasing company news, articles, and updates.
 * Includes modern card design with hover effects.
 * 
 * @returns JSX element containing blog section
 */
const BlogSection = () => {
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

  // Use static blog posts
  const blogPosts = Array.isArray(blogPostsData) ? blogPostsData : [];
  
  // Filter only published posts
  const publishedPosts = blogPosts.filter((post: any) => post.published !== false);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-white via-muted/10 to-white relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-sky/20 rounded-full mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              المدونة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اطلع على آخر الأخبار والمقالات حول صناعة الصلب والتقنيات الحديثة
            </p>
          </div>

          {/* Blog Posts Grid */}
          {publishedPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لا توجد مقالات متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {publishedPosts.map((post: any) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-muted hover:border-primary/20"
              >
                {/* Post Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-sky/10">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary/80 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Read More Button */}
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-between group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                  >
                    <Link to={`/blog/${post.id}`}>
                      <span>اقرأ المزيد</span>
                      <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>

                {/* Hover Effect Line */}
                <div className="h-1 w-0 bg-gradient-to-r from-primary via-sky to-primary group-hover:w-full transition-all duration-700" />
              </article>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-sky hover:from-primary/90 hover:to-sky/90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Link to="/blog">
                عرض جميع المقالات
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

