import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { blogAPI } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/admin/FileUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Blog Management Page
 */
const Blog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const queryClient = useQueryClient();

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string) => {
    if (!src || !src.trim()) return "";
    // Handle base64 images
    if (src.startsWith("data:image/")) return src;
    // Handle full URLs
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    // Handle relative paths from uploads
    if (src.startsWith("/uploads/")) return `${apiOrigin}${src}`;
    // Return as-is for other cases (might be base64 without prefix or relative path)
    return src;
  };

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: blogAPI.getAll,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Ensure posts is always an array
  const posts = Array.isArray(postsData) ? postsData : [];

  const deleteMutation = useMutation({
    mutationFn: blogAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      toast.success("تم حذف المقال بنجاح");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingPost(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">إدارة المدونة</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وعرض جميع مقالات المدونة
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة مقال جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المقالات</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الصورة</TableHead>
                  <TableHead>العنوان</TableHead>
                  <TableHead>التصنيف</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts?.map((post: any) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      {(() => {
                        const imageSrc = post.image ? resolveImage(post.image) : null;
                        
                        if (imageSrc && imageSrc.trim()) {
                          return (
                            <img
                              src={imageSrc}
                              alt={post.title || ""}
                              className="w-16 h-16 object-cover rounded border border-muted"
                              onError={(e) => {
                                // If image fails to load, show placeholder
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">لا صورة</div>`;
                                }
                              }}
                            />
                          );
                        }
                        
                        return (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                            لا صورة
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.date}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.published ? "منشور" : "مسودة"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <BlogPostDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        post={editingPost}
      />
    </div>
  );
};

interface BlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: any;
}

const BlogPostDialog = ({ open, onOpenChange, post }: BlogPostDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!post;
  const [activeTab, setActiveTab] = useState<"ar" | "en">("ar");

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string) => {
    if (!src || !src.trim()) return "";
    // Handle base64 images
    if (src.startsWith("data:image/")) return src;
    // Handle full URLs
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    // Handle relative paths from uploads
    if (src.startsWith("/uploads/")) return `${apiOrigin}${src}`;
    // Return as-is for other cases (might be base64 without prefix or relative path)
    return src;
  };

  const initialValues =
    post
      ? {
          ...post,
          titleEn: post.titleEn || "",
          excerptEn: post.excerptEn || "",
          contentEn: post.contentEn || "",
          date: post.date ? post.date.split("T")[0] : "",
          image: post.image ? resolveImage(post.image) : "",
        }
      : {
          title: "",
          titleEn: "",
          excerpt: "",
          excerptEn: "",
          content: "",
          contentEn: "",
          category: "تقنيات",
          date: new Date().toISOString().split("T")[0],
          image: "",
          published: true,
        };

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [post, reset]);

  const published = watch("published");
  const imageValue = watch("image");

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditing) {
        return blogAPI.update(post.id, data);
      }
      return blogAPI.create(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      await queryClient.refetchQueries({ queryKey: ["blogPosts"] });
      toast.success(isEditing ? "تم تحديث المقال" : "تم إضافة المقال");
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      console.error("Error saving blog post:", error);
      toast.error(`فشل الحفظ: ${error.message || "حدث خطأ غير متوقع"}`);
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "تعديل المقال" : "إضافة مقال جديد"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "قم بتعديل معلومات المقال"
              : "أدخل معلومات المقال الجديد"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "ar" | "en")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ar">العربية</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ar" className="space-y-4">
              <div>
                <Label>العنوان (العربية)</Label>
                <Input {...register("title")} required />
              </div>
              <div>
                <Label>الملخص (العربية)</Label>
                <Textarea {...register("excerpt")} rows={3} required />
              </div>
              <div>
                <Label>المحتوى الكامل (العربية)</Label>
                <Textarea {...register("content")} rows={8} required />
              </div>
            </TabsContent>
            
            <TabsContent value="en" className="space-y-4">
              <div>
                <Label>العنوان (English)</Label>
                <Input {...register("titleEn")} />
              </div>
              <div>
                <Label>الملخص (English)</Label>
                <Textarea {...register("excerptEn")} rows={3} />
              </div>
              <div>
                <Label>المحتوى الكامل (English)</Label>
                <Textarea {...register("contentEn")} rows={8} />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>التصنيف</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="تقنيات">تقنيات</SelectItem>
                  <SelectItem value="الجودة">الجودة</SelectItem>
                  <SelectItem value="الاستدامة">الاستدامة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>التاريخ</Label>
              <Input type="date" {...register("date")} required />
            </div>
          </div>
          <div>
            <FileUpload
              value={imageValue}
              onChange={(url) => setValue("image", url)}
              label="صورة المقال"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={published}
              onCheckedChange={(checked) => setValue("published", checked)}
            />
            <Label>نشر المقال</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "جاري الحفظ..." : isEditing ? "تحديث" : "إضافة"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Blog;

