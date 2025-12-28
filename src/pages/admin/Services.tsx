import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Wrench, Beaker, X, ChevronRight } from "lucide-react";
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
import { servicesAPI } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/admin/FileUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/RichTextEditor";

/**
 * Services Management Page
 */
const Services = () => {
  const [activeTab, setActiveTab] = useState<"categories" | "services">("categories");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">إدارة الخدمات</h1>
        <p className="text-muted-foreground mt-2">
          إدارة تصنيفات الخدمات والخدمات المتاحة
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "categories" | "services")}>
        <TabsList>
          <TabsTrigger value="categories">التصنيفات</TabsTrigger>
          <TabsTrigger value="services">الخدمات</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="services">
          <ServicesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Categories Tab
const CategoriesTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["services", "categories", "admin"],
    queryFn: servicesAPI.listCategories,
    refetchOnWindowFocus: true,
  });

  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const deleteMutation = useMutation({
    mutationFn: servicesAPI.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("تم حذف التصنيف بنجاح");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا التصنيف؟ سيتم حذف جميع الخدمات المرتبطة به.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">التصنيفات</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة تصنيف جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة التصنيفات</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم (إنجليزي)</TableHead>
                  <TableHead>الاسم بالعربية</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>التصنيف الأب</TableHead>
                  <TableHead>عدد الخدمات</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category: any) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.nameAr}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description || "-"}
                    </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {category.parentId
                      ? (categories.find((c: any) => c.id === category.parentId)?.nameAr ||
                         categories.find((c: any) => c.id === category.parentId)?.name ||
                         "تصنيف أب")
                      : "-"}
                  </TableCell>
                    <TableCell>{category.services?.length || 0}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
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

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
      />
    </>
  );
};

// Services Tab
const ServicesTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const queryClient = useQueryClient();

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("/uploads/")) return `${apiOrigin}${src}`;
    return src;
  };

  const { data: categoriesData } = useQuery({
    queryKey: ["services", "categories", "admin"],
    queryFn: servicesAPI.listCategories,
  });

  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ["services", "admin", selectedCategoryId],
    queryFn: () => servicesAPI.listServices(selectedCategoryId),
    refetchOnWindowFocus: true,
  });

  const services = Array.isArray(servicesData) ? servicesData : [];

  const deleteMutation = useMutation({
    mutationFn: servicesAPI.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("تم حذف الخدمة بنجاح");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الخدمة؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">الخدمات</h2>
          {categories.length > 0 && (
            <Select
              value={selectedCategoryId?.toString() || "all"}
              onValueChange={(v) => setSelectedCategoryId(v === "all" ? undefined : parseInt(v))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="جميع التصنيفات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.nameAr || cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Button onClick={handleAdd} disabled={categories.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة خدمة جديدة
        </Button>
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              يرجى إضافة تصنيف أولاً قبل إضافة الخدمات
            </p>
          </CardContent>
        </Card>
      )}

      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>قائمة الخدمات</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الصورة</TableHead>
                    <TableHead>الاسم (إنجليزي)</TableHead>
                    <TableHead>الاسم بالعربية</TableHead>
                    <TableHead>التصنيف</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service: any) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        {service.imageUrl ? (
                          <img
                            src={resolveImage(service.imageUrl)}
                            alt={service.nameAr || service.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                            لا صورة
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.nameAr}</TableCell>
                      <TableCell>{service.category?.nameAr || service.category?.name || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(service)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(service.id)}
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
      )}

      <ServiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={editingService}
        categories={categories}
      />
    </>
  );
};

// Category Dialog
interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: any;
}

const CategoryDialog = ({ open, onOpenChange, category }: CategoryDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!category;
  const categories = queryClient.getQueryData<any[]>(["services", "categories", "admin"]) || [];

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: category || {
      name: "",
      nameAr: "",
      description: "",
      icon: "beaker",
      order: 0,
      isActive: true,
      parentId: null,
    },
  });

  const iconValue = watch("icon");
  const parentValue = watch("parentId");

  useEffect(() => {
    reset(
      category || {
        name: "",
        nameAr: "",
        description: "",
        icon: "beaker",
        order: 0,
        isActive: true,
        parentId: null,
      }
    );
  }, [category, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditing) {
        return servicesAPI.updateCategory(category.id, data);
      }
      return servicesAPI.createCategory(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(isEditing ? "تم تحديث التصنيف" : "تم إضافة التصنيف");
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(`فشل الحفظ: ${error.message || "حدث خطأ غير متوقع"}`);
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>الاسم (إنجليزي)</Label>
            <Input {...register("name")} required />
          </div>
          <div>
            <Label>الاسم بالعربية</Label>
            <Input {...register("nameAr")} required />
          </div>
          <div>
            <Label>الوصف</Label>
            <Textarea {...register("description")} rows={3} />
          </div>
          <div>
            <Label>الأيقونة</Label>
            <Select value={iconValue} onValueChange={(v) => reset({ ...watch(), icon: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beaker">Beaker (أجهزة)</SelectItem>
                <SelectItem value="wrench">Wrench (ورش)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>ترتيب العرض</Label>
            <Input type="number" {...register("order", { valueAsNumber: true })} />
          </div>
          <div>
            <Label>التصنيف الأب (اختياري)</Label>
            <Select
              value={parentValue ? parentValue.toString() : "none"}
              onValueChange={(v) => setValue("parentId", v === "none" ? null : parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="بدون تصنيف أب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون تصنيف أب</SelectItem>
                {categories
                  .filter((c) => !isEditing || c.id !== category?.id)
                  .map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nameAr || cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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

// Service Dialog
interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: any;
  categories: any[];
}

const ServiceDialog = ({ open, onOpenChange, service, categories }: ServiceDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!service;

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  const resolveImage = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("/uploads/")) return `${apiOrigin}${src}`;
    return src;
  };

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: service || {
      name: "",
      nameAr: "",
      description: "",
      descriptionEn: "",
      imageUrl: "",
      gallery: [],
      categoryId: categories[0]?.id || 0,
      capabilities: [],
      equipment: [],
      order: 0,
      isActive: true,
    },
  });

  const imageValue = watch("imageUrl");
  const gallery = watch("gallery") || [];
  const capabilities = watch("capabilities") || [];
  const equipment = watch("equipment") || [];
  const description = watch("description") || "";
  const descriptionEn = watch("descriptionEn") || "";

  useEffect(() => {
    reset(
      service
        ? {
            ...service,
            gallery: Array.isArray(service.gallery)
              ? service.gallery
              : service.gallery
                ? typeof service.gallery === 'string'
                  ? JSON.parse(service.gallery)
                  : service.gallery
                : [],
            capabilities: Array.isArray(service.capabilities)
              ? service.capabilities
              : service.capabilities
                ? typeof service.capabilities === 'string'
                  ? JSON.parse(service.capabilities)
                  : []
                : [],
            equipment: Array.isArray(service.equipment)
              ? service.equipment
              : service.equipment
                ? typeof service.equipment === 'string'
                  ? JSON.parse(service.equipment)
                  : []
                : [],
          }
        : {
            name: "",
            nameAr: "",
            description: "",
            descriptionEn: "",
            imageUrl: "",
            gallery: [],
            categoryId: categories[0]?.id || 0,
            capabilities: [],
            equipment: [],
            order: 0,
            isActive: true,
          }
    );
  }, [service, reset, categories]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditing) {
        return servicesAPI.updateService(service.id, data);
      }
      return servicesAPI.createService(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(isEditing ? "تم تحديث الخدمة" : "تم إضافة الخدمة");
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(`فشل الحفظ: ${error.message || "حدث خطأ غير متوقع"}`);
    },
  });

  const onSubmit = (data: any) => {
    const formattedData = {
      ...data,
      gallery: Array.isArray(data.gallery) ? data.gallery.filter((img: string) => img && img.trim()) : [],
      capabilities: Array.isArray(data.capabilities)
        ? data.capabilities
        : typeof data.capabilities === 'string'
          ? data.capabilities.split('\n').filter((line: string) => line.trim())
          : [],
      equipment: Array.isArray(data.equipment)
        ? data.equipment
        : typeof data.equipment === 'string'
          ? data.equipment.split('\n').filter((line: string) => line.trim())
          : [],
    };
    mutation.mutate(formattedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>الاسم (إنجليزي)</Label>
            <Input {...register("name")} required />
          </div>
          <div>
            <Label>الاسم بالعربية</Label>
            <Input {...register("nameAr")} required />
          </div>
          <Tabs defaultValue="ar" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ar">العربية</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ar" className="space-y-4">
              <div>
                <Label>الوصف (العربية)</Label>
                <RichTextEditor
                  value={description}
                  onChange={(value) => setValue("description", value, { shouldValidate: true })}
                  placeholder="أدخل وصف الخدمة..."
                  dir="rtl"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="en" className="space-y-4">
              <div>
                <Label>الوصف (English)</Label>
                <RichTextEditor
                  value={descriptionEn}
                  onChange={(value) => setValue("descriptionEn", value)}
                  placeholder="Enter service description..."
                  dir="ltr"
                />
              </div>
            </TabsContent>
          </Tabs>
          <div>
            <Label>التصنيف</Label>
            <Select
              value={watch("categoryId")?.toString() || ""}
              onValueChange={(v) => setValue("categoryId", parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.nameAr || cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <FileUpload
              value={imageValue}
              onChange={(url) => setValue("imageUrl", url)}
              label="الصورة الرئيسية"
            />
          </div>
          <div>
            <Label>معرض الصور</Label>
            <div className="space-y-2">
              {gallery.map((img: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <img
                        src={resolveImage(img)}
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
          </div>
          <div>
            <Label>القدرات والخدمات (كل عنصر في سطر)</Label>
            <Textarea
              value={Array.isArray(capabilities) ? capabilities.join("\n") : (capabilities || "")}
              onChange={(e) => {
                const lines = e.target.value.split("\n");
                setValue("capabilities", lines);
              }}
              onBlur={(e) => {
                const lines = e.target.value.split("\n").filter(line => line.trim());
                if (lines.length > 0) {
                  setValue("capabilities", lines);
                }
              }}
              rows={4}
              placeholder="القدرة 1&#10;القدرة 2&#10;القدرة 3"
            />
          </div>
          <div>
            <Label>المعدات (كل عنصر في سطر)</Label>
            <Textarea
              value={Array.isArray(equipment) ? equipment.join("\n") : (equipment || "")}
              onChange={(e) => {
                const lines = e.target.value.split("\n");
                setValue("equipment", lines);
              }}
              onBlur={(e) => {
                const lines = e.target.value.split("\n").filter(line => line.trim());
                if (lines.length > 0) {
                  setValue("equipment", lines);
                }
              }}
              rows={4}
              placeholder="المعدة 1&#10;المعدة 2&#10;المعدة 3"
            />
          </div>
          <div>
            <Label>ترتيب العرض</Label>
            <Input type="number" {...register("order", { valueAsNumber: true })} />
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

export default Services;

