import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Package, X, Copy } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { productsAPI } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/admin/FileUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Products Management Page
 */
const Products = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const queryClient = useQueryClient();

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("/uploads/")) return `${apiOrigin}${src}`;
    return src;
  };

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productsAPI.getAll,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache
    cacheTime: 0, // Legacy support
  });

  // Ensure products is always an array
  const products = Array.isArray(productsData) ? productsData : [];

  const deleteMutation = useMutation({
    mutationFn: productsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تم حذف المنتج بنجاح");
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: productsAPI.duplicate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تم إنشاء نسخة من المنتج");
    },
    onError: () => {
      toast.error("تعذر تكرار المنتج");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDuplicate = (id: number) => {
    duplicateMutation.mutate(id);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">إدارة المنتجات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وعرض جميع منتجات الشركة
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة منتج جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الصورة</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.imageUrl || product.image ? (
                        <img
                          src={resolveImage(product.imageUrl || product.image)}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            // If image fails to load, show placeholder
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">لا صورة</div>`;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          لا صورة
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicate(product.id)}
                        title="تكرار المنتج"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
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

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={editingProduct}
      />
    </div>
  );
};

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
}

const ProductDialog = ({ open, onOpenChange, product }: ProductDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!product;
  const [activeTab, setActiveTab] = useState<"ar" | "en">("ar");

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: product || {
      name: "",
      nameEn: "",
      description: "",
      descriptionEn: "",
      fullDescription: "",
      fullDescriptionEn: "",
      imageUrl: "",
      category: "",
      categoryEn: "",
      specifications: [],
      applications: [],
      material: "",
      materialEn: "",
      inStock: true,
      isActive: true,
    },
  });

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("/uploads/")) return `${apiOrigin}${src}`;
    return src;
  };

  const imageValue = watch("imageUrl");
  const gallery = watch("gallery") || [];
  const specifications = watch("specifications") || [];
  const applications = watch("applications") || [];

  // Sync form with selected product
  useEffect(() => {
    reset(
      product
        ? { 
            ...product, 
            nameEn: product.nameEn || "",
            descriptionEn: product.descriptionEn || "",
            fullDescriptionEn: product.fullDescriptionEn || "",
            categoryEn: product.categoryEn || "",
            materialEn: product.materialEn || "",
            imageUrl: product.imageUrl || (product as any).image || "",
            gallery: Array.isArray(product.gallery) 
              ? product.gallery 
              : product.gallery 
                ? (typeof product.gallery === 'string' ? JSON.parse(product.gallery) : product.gallery)
                : [],
            specifications: Array.isArray(product.specifications) 
              ? product.specifications 
              : product.specifications 
                ? JSON.parse(product.specifications as any)
                : [],
            applications: Array.isArray(product.applications)
              ? product.applications
              : product.applications
                ? JSON.parse(product.applications as any)
                : [],
          }
        : {
            name: "",
            nameEn: "",
            description: "",
            descriptionEn: "",
            fullDescription: "",
            fullDescriptionEn: "",
            imageUrl: "",
            gallery: [],
            category: "",
            categoryEn: "",
            specifications: [],
            applications: [],
            material: "",
            materialEn: "",
            inStock: true,
            isActive: true,
          },
    );
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditing) {
        return productsAPI.update(product.id, data);
      }
      return productsAPI.create(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.refetchQueries({ queryKey: ["products"] });
      toast.success(isEditing ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح");
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      console.error("Error saving product:", error);
      toast.error(`فشل الحفظ: ${error.message || "حدث خطأ غير متوقع"}`);
    },
  });

  const onSubmit = (data: any) => {
    // Ensure specifications and applications are arrays
    const formattedData = {
      ...data,
      gallery: Array.isArray(data.gallery) ? data.gallery.filter((img: string) => img && img.trim()) : [],
      specifications: Array.isArray(data.specifications) 
        ? data.specifications 
        : typeof data.specifications === 'string'
          ? data.specifications.split('\n').filter((line: string) => line.trim())
          : [],
      applications: Array.isArray(data.applications)
        ? data.applications
        : typeof data.applications === 'string'
          ? data.applications.split('\n').filter((line: string) => line.trim())
          : [],
    };
    mutation.mutate(formattedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "ar" | "en")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ar">العربية</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ar" className="space-y-4">
          <div>
                <Label>اسم المنتج (العربية)</Label>
            <Input {...register("name")} required />
          </div>
          <div>
                <Label>الفئة (العربية)</Label>
            <Input {...register("category")} placeholder="تروس / أدوات ..." />
          </div>
          <div>
                <Label>الوصف القصير (العربية)</Label>
            <Textarea {...register("description")} required />
          </div>
          <div>
                <Label>الوصف الكامل (العربية)</Label>
            <Textarea {...register("fullDescription")} rows={4} />
          </div>
          <div>
                <Label>المادة (العربية)</Label>
            <Input {...register("material")} placeholder="مثال: فولاذ / حديد ..." />
          </div>
            </TabsContent>
            
            <TabsContent value="en" className="space-y-4">
              <div>
                <Label>اسم المنتج (English)</Label>
                <Input {...register("nameEn")} />
              </div>
              <div>
                <Label>الفئة (English)</Label>
                <Input {...register("categoryEn")} placeholder="Gears / Tools ..." />
              </div>
              <div>
                <Label>الوصف القصير (English)</Label>
                <Textarea {...register("descriptionEn")} />
              </div>
              <div>
                <Label>الوصف الكامل (English)</Label>
                <Textarea {...register("fullDescriptionEn")} rows={4} />
              </div>
              <div>
                <Label>المادة (English)</Label>
                <Input {...register("materialEn")} placeholder="e.g: Steel / Iron ..." />
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Common fields */}
          <div>
            <Label>المواصفات</Label>
            <Textarea
              value={Array.isArray(specifications) ? specifications.join("\n") : (specifications || "")}
              onChange={(e) => {
                const value = e.target.value;
                const lines = value.split("\n");
                setValue("specifications", lines);
              }}
              onBlur={(e) => {
                const lines = e.target.value.split("\n").filter(line => line.trim());
                if (lines.length > 0) {
                  setValue("specifications", lines);
                }
              }}
              rows={4}
              placeholder="المواصفة 1&#10;المواصفة 2&#10;المواصفة 3"
            />
            <p className="text-xs text-muted-foreground mt-1">
              اكتب كل مواصفة في سطر منفصل (يمكنك الضغط Enter للسطر الجديد)
            </p>
          </div>
          <div>
            <Label>مجالات التطبيق</Label>
            <Textarea
              value={Array.isArray(applications) ? applications.join("\n") : (applications || "")}
              onChange={(e) => {
                const value = e.target.value;
                const lines = value.split("\n");
                setValue("applications", lines);
              }}
              onBlur={(e) => {
                const lines = e.target.value.split("\n").filter(line => line.trim());
                if (lines.length > 0) {
                  setValue("applications", lines);
                }
              }}
              rows={4}
              placeholder="المجال 1&#10;المجال 2&#10;المجال 3"
            />
            <p className="text-xs text-muted-foreground mt-1">
              اكتب كل مجال تطبيق في سطر منفصل (يمكنك الضغط Enter للسطر الجديد)
            </p>
          </div>
          <div>
            <FileUpload
              value={imageValue}
              onChange={(url) => setValue("imageUrl", url)}
              label="صورة المنتج الرئيسية"
            />
          </div>
          <div>
            <Label>معرض الصور</Label>
            <div className="space-y-2">
              {gallery.map((img: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      const newGallery = gallery.filter((_: string, i: number) => i !== index);
                      setValue("gallery", newGallery);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <FileUpload
                value=""
                onChange={(url) => {
                  if (url) {
                    setValue("gallery", [...gallery, url]);
                  }
                }}
                label="إضافة صورة للمعرض"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              يمكنك إضافة صور إضافية للمنتج لعرضها في معرض الصور
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inStock"
              {...register("inStock")}
              className="w-4 h-4"
            />
            <Label htmlFor="inStock" className="cursor-pointer">
              متوفر في المخزن
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="w-4 h-4"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              نشط (يظهر في الموقع)
            </Label>
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

export default Products;

