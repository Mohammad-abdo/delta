import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { qualityAPI } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

const Quality = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["quality"],
    queryFn: qualityAPI.get,
  });

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: data || { policies: [] },
  });

  const policies = watch("policies") || [];

  const mutation = useMutation({
    mutationFn: (data: any) => qualityAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quality"] });
      toast.success("تم حفظ التغييرات بنجاح");
    },
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  const addPolicy = () => {
    setValue("policies", [...policies, { title: "", description: "" }]);
  };

  const removePolicy = (index: number) => {
    setValue("policies", policies.filter((_: any, i: number) => i !== index));
  };

  if (isLoading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">إدارة سياسة الجودة</h1>
        <p className="text-muted-foreground mt-2">تعديل محتوى صفحة سياسة الجودة</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>المحتوى الرئيسي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>العنوان</Label>
              <Input {...register("title")} defaultValue={data?.title} />
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea {...register("description")} defaultValue={data?.description} rows={4} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>السياسات</CardTitle>
                <CardDescription>إدارة سياسات الجودة والبيئة والسلامة</CardDescription>
              </div>
              <Button type="button" onClick={addPolicy}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة سياسة
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {policies.map((policy: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">سياسة {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removePolicy(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>العنوان</Label>
                    <Input
                      {...register(`policies.${index}.title`)}
                      defaultValue={policy.title}
                    />
                  </div>
                  <div>
                    <Label>الوصف</Label>
                    <Textarea
                      {...register(`policies.${index}.description`)}
                      defaultValue={policy.description}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Quality;

