import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { heroAPI } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";

/**
 * Hero Section Management Page
 */
const Hero = () => {
  const queryClient = useQueryClient();
  const { data: heroData, isLoading } = useQuery({
    queryKey: ["hero"],
    queryFn: heroAPI.get,
  });

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: heroData || { slides: [] },
  });

  const slides = watch("slides") || [];

  const mutation = useMutation({
    mutationFn: (data: any) => heroAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero"] });
      toast.success("تم حفظ التغييرات بنجاح");
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: "",
      subtitle: "",
      description: "",
      image: "",
      buttonText: "",
      link: "",
      stats: [],
    };
    setValue("slides", [...slides, newSlide]);
  };

  const removeSlide = (index: number) => {
    const newSlides = slides.filter((_: any, i: number) => i !== index);
    setValue("slides", newSlides);
  };

  if (isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">إدارة الصفحة الرئيسية</h1>
        <p className="text-muted-foreground mt-2">
          تعديل محتوى قسم Hero في الصفحة الرئيسية
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>شرائح الصفحة الرئيسية</CardTitle>
                <CardDescription>
                  إدارة الشرائح المعروضة في الصفحة الرئيسية
                </CardDescription>
              </div>
              <Button type="button" onClick={addSlide}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة شريحة
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {slides.map((slide: any, index: number) => (
              <Card key={slide.id || index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>شريحة {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSlide(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>العنوان الرئيسي</Label>
                    <Input
                      {...register(`slides.${index}.title`)}
                      defaultValue={slide.title}
                    />
                  </div>
                  <div>
                    <Label>العنوان الفرعي</Label>
                    <Input
                      {...register(`slides.${index}.subtitle`)}
                      defaultValue={slide.subtitle}
                    />
                  </div>
                  <div>
                    <Label>الوصف</Label>
                    <Textarea
                      {...register(`slides.${index}.description`)}
                      defaultValue={slide.description}
                      rows={3}
                    />
                  </div>
                  <div>
                    <FileUpload
                      value={slide.image}
                      onChange={(url) => setValue(`slides.${index}.image`, url)}
                      label="صورة الشريحة"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>نص الزر</Label>
                      <Input
                        {...register(`slides.${index}.buttonText`)}
                        defaultValue={slide.buttonText}
                      />
                    </div>
                    <div>
                      <Label>رابط الزر</Label>
                      <Input
                        {...register(`slides.${index}.link`)}
                        defaultValue={slide.link}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Hero;

