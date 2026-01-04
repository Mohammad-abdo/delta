import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogAPI } from "@/lib/api";
import { resolveImageUrl } from "@/lib/imageUtils";

/**
 * Single Post Page
 * 
 * Displays a single blog post with full content.
 * 
 * @returns JSX element containing single post page
 */
const SinglePost = () => {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();

  const resolveImage = resolveImageUrl;

  const { data: post, isLoading } = useQuery({
    queryKey: ["publicBlogPost", id],
    queryFn: () => blogAPI.getPublished(Number(id)),
    enabled: Boolean(id),
  });

  const { data: postsData } = useQuery({
    queryKey: ["publicBlogPosts"],
    queryFn: blogAPI.listPublished,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">جاري تحميل المقال...</p>
      </div>
    );
  }

  const { t } = useTranslation();

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            {i18n.language === 'en' ? 'Post Not Found' : 'المقال غير موجود'}
          </h1>
          <Button asChild>
            <Link to="/news">
              {i18n.language === 'en' ? 'Back to News' : 'العودة إلى الأخبار'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const relatedPosts =
    Array.isArray(postsData) && post?.category
      ? postsData.filter((p: any) => p.id !== post.id && p.category === post.category).slice(0, 2)
      : [];

  const formattedDate = post.date ? new Date(post.date).toLocaleDateString(i18n.language === 'en' ? "en-US" : "ar-EG") : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-muted/10 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button asChild variant="ghost">
              <Link to="/news" className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                {i18n.language === 'en' ? 'Back to News' : 'العودة إلى الأخبار'}
              </Link>
            </Button>
          </div>

          {/* Post Header */}
          <div className="mb-8">
            {/* Category */}
            <div className="mb-4">
              <span className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-full">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              {i18n.language === 'en' && post.titleEn ? post.titleEn : post.title}
            </h1>

            {/* Date */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-5 h-5" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl bg-muted">
              <img
                src={resolveImage(post.image)}
                alt={i18n.language === 'en' && post.titleEn ? post.titleEn : (post.title || '')}
                className="w-full h-96 object-contain bg-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-96 flex items-center justify-center bg-muted"><svg class="w-16 h-16 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                  }
                }}
              />
            </div>
          )}

          {/* Post Content */}
          <article className="prose prose-lg max-w-none">
            <div
              className="text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: i18n.language === 'en' && post.contentEn ? post.contentEn : post.content }}
            />
          </article>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-muted">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-primary">
                {i18n.language === 'en' ? 'Related Posts' : 'مقالات ذات صلة'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost: any) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.id}`}
                    className="group block bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all border border-muted hover:border-primary/20"
                  >
                    <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-primary/80">
                      {i18n.language === 'en' && relatedPost.titleEn ? relatedPost.titleEn : relatedPost.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {i18n.language === 'en' && relatedPost.excerptEn ? relatedPost.excerptEn : relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;

