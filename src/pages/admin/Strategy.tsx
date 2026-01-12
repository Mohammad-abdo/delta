import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { strategyAPI } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

const Strategy = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["strategy"],
    queryFn: strategyAPI.get,
  });

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: data || { points: [] },
  });

  const points = watch("points") || [];

  const mutation = useMutation({
    mutationFn: (data: any) => strategyAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategy"] });
      toast.success("تم حفظ التغييرات بنجاح");
    },
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  const addPoint = () => {
    setValue("points", [...points, ""]);
  };

  const removePoint = (index: number) => {
    setValue("points", points.filter((_: any, i: number) => i !== index));
  };

  if (isLoading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">إدارة الاستراتيجية</h1>
        <p className="text-muted-foreground mt-2">تعديل محتوى صفحة الاستراتيجية</p>
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
                <CardTitle>نقاط الاستراتيجية</CardTitle>
                <CardDescription>إدارة نقاط الاستراتيجية</CardDescription>
              </div>
              <Button type="button" onClick={addPoint}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة نقطة
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {points.map((point: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  {...register(`points.${index}`)}
                  defaultValue={point}
                  placeholder={`نقطة ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removePoint(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
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

export default Strategy;

