import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { aboutAPI } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/admin/FileUpload";

/**
 * About Section Management Page
 */
const About = () => {
  const queryClient = useQueryClient();
  const { data: aboutData, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: aboutAPI.get,
  });

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: aboutData || {},
  });

  const imageValue = watch("image");

  const mutation = useMutation({
    mutationFn: (data: any) => aboutAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("تم حفظ التغييرات بنجاح");
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">إدارة صفحة عن الشركة</h1>
        <p className="text-muted-foreground mt-2">
          تعديل محتوى صفحة عن الشركة
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>المحتوى الرئيسي</CardTitle>
            <CardDescription>تعديل المحتوى الأساسي لصفحة عن الشركة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>العنوان</Label>
              <Input {...register("title")} defaultValue={aboutData?.title} />
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea
                {...register("description")}
                defaultValue={aboutData?.description}
                rows={6}
              />
            </div>
            <div>
              <FileUpload
                value={imageValue}
                onChange={(url) => setValue("image", url)}
                label="صورة القسم"
              />
            </div>
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

export default About;

