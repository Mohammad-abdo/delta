import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Beaker } from "lucide-react";
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
import { laboratoryEquipmentAPI } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/admin/FileUpload";

/**
 * Laboratory Equipment Management Page
 */
const LaboratoryEquipment = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: equipmentData, isLoading, refetch } = useQuery({
    queryKey: ["laboratoryEquipment"],
    queryFn: laboratoryEquipmentAPI.getAll,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Ensure equipment is always an array
  const equipment = Array.isArray(equipmentData) ? equipmentData : [];

  const deleteMutation = useMutation({
    mutationFn: laboratoryEquipmentAPI.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["laboratoryEquipment"] });
      await queryClient.refetchQueries({ queryKey: ["laboratoryEquipment"] });
      toast.success("تم حذف الجهاز بنجاح");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الجهاز؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (item: any) => {
    setEditingEquipment(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingEquipment(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">إدارة أجهزة المعامل</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وعرض جميع أجهزة المعامل
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة جهاز جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الأجهزة</CardTitle>
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
                  <TableHead>النوع/الموديل</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment && Array.isArray(equipment) && equipment.length > 0 ? (
                  equipment.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.model || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      لا توجد أجهزة متاحة
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <EquipmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        equipment={editingEquipment}
      />
    </div>
  );
};

interface EquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: any;
}

const EquipmentDialog = ({ open, onOpenChange, equipment }: EquipmentDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!equipment;

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: equipment || {
      name: "",
      model: "",
      description: "",
      image: "",
      features: [],
      specifications: [],
    },
  });

  const features = watch("features") || [];
  const specifications = watch("specifications") || [];
  const imageValue = watch("image");

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditing) {
        return laboratoryEquipmentAPI.update(equipment.id, data);
      }
      return laboratoryEquipmentAPI.create(data);
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["laboratoryEquipment"] });
      await queryClient.refetchQueries({ queryKey: ["laboratoryEquipment"] });
      toast.success(isEditing ? "تم تحديث الجهاز" : "تم إضافة الجهاز");
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      console.error("Error saving equipment:", error);
      toast.error(`فشل الحفظ: ${error.message || "حدث خطأ غير متوقع"}`);
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const addFeature = () => {
    setValue("features", [...features, ""]);
  };

  const removeFeature = (index: number) => {
    setValue("features", features.filter((_: any, i: number) => i !== index));
  };

  const addSpecification = () => {
    setValue("specifications", [...specifications, ""]);
  };

  const removeSpecification = (index: number) => {
    setValue("specifications", specifications.filter((_: any, i: number) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "تعديل الجهاز" : "إضافة جهاز جديد"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "قم بتعديل معلومات الجهاز"
              : "أدخل معلومات الجهاز الجديد"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>اسم الجهاز</Label>
            <Input {...register("name")} required />
          </div>
          <div>
            <Label>النوع/الموديل</Label>
            <Input {...register("model")} placeholder="مثال: SpectroMAXx" />
          </div>
          <div>
            <Label>الوصف</Label>
            <Textarea {...register("description")} rows={4} required />
          </div>
          <div>
            <FileUpload
              value={imageValue}
              onChange={(url) => setValue("image", url)}
              label="صورة الجهاز"
            />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>الاستخدامات والفوائد</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                <Plus className="w-4 h-4 mr-1" />
                إضافة
              </Button>
            </div>
            {features.map((feature: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  {...register(`features.${index}`)}
                  defaultValue={feature}
                  placeholder={`استخدام ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Specifications */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>المواصفات</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                <Plus className="w-4 h-4 mr-1" />
                إضافة
              </Button>
            </div>
            {specifications.map((spec: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  {...register(`specifications.${index}`)}
                  defaultValue={spec}
                  placeholder={`مواصفة ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSpecification(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
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

export default LaboratoryEquipment;

